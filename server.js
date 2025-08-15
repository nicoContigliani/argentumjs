require('dotenv').config();
const path = require('path');
const Hapi = require('@hapi/hapi');
const { Boom } = require('@hapi/boom');

async function createServer() {
  // 1. Configuración del servidor
  const server = Hapi.server({
    port: process.env.PORT || 3000,
    host: process.env.HOST || 'localhost',
    routes: {
      cors: {
        origin: ['*'],
        credentials: true,
        additionalHeaders: ['cache-control', 'x-requested-with']
      },
      validate: {
        failAction: async (request, h, err) => {
          if (process.env.NODE_ENV === 'production') {
            throw Boom.badRequest('Invalid request payload');
          }
          throw err;
        }
      },
      security: {
        hsts: {
          maxAge: 31536000,
          includeSubDomains: true,
          preload: true
        },
        noSniff: true,
        xframe: 'deny',
        xss: true
      }
    },
    debug: process.env.NODE_ENV === 'development' ? 
      { request: ['error'], log: ['error'] } : false
  });

  // 2. Cargar configuración
  try {
    const { loadConfig } = require('./lib/config/loader');
    server.app.config = await loadConfig();
    server.log(['info'], 'Configuration loaded');
  } catch (err) {
    console.error('❌ Failed to load config:', err);
    throw err;
  }

  // 3. Registrar plugins esenciales (DB primero)
  try {
    // 3.1. Error Handler
    await server.register(require('./lib/plugins/error-handler'));

    // 3.2. MongoDB
    await server.register({
      plugin: require('./plugins/db/mongoose'),
      options: {}
    });
    console.log('✅ MongoDB plugin registered');

    // 3.3. Autenticación JWT
    await server.register({
      plugin: require('./plugins/auth/jwt'),
      options: {}
    });
    console.log('✅ JWT Auth plugin registered');

  } catch (err) {
    console.error('❌ Plugin registration failed:', err);
    throw err;
  }

  // 4. Registrar módulos/rutas
  try {
    await server.register([
      {
        plugin: require('./modules/users/routes/user.routes'),
        routes: { prefix: '/api' }
      }
    ]);
    console.log('✅ User routes registered');
  } catch (err) {
    console.error('❌ Failed to register routes:', err);
    throw err;
  }

  // 5. Health Check
  server.route({
    method: 'GET',
    path: '/health',
    options: {
      auth: false,
      tags: ['api', 'system'],
      description: 'Health check endpoint'
    },
    handler: () => ({
      status: 'OK',
      timestamp: new Date().toISOString(),
      uptime: process.uptime()
    })
  });

  // 6. Logging de rutas al iniciar
  server.events.on('start', () => {
    console.log('\n📌 Registered routes:');
    server.table().forEach(route => {
      console.log(`  ${route.method.toUpperCase().padEnd(6)} ${route.path}`);
    });
  });

  // 7. Manejo de cierre
  const stopServer = async () => {
    console.log('\n🛑 Stopping server...');
    await server.stop({ timeout: 5000 });
    console.log('Server stopped');
    process.exit(0);
  };

  process.on('SIGINT', stopServer);
  process.on('SIGTERM', stopServer);

  return server;
}

async function start() {
  try {
    const server = await createServer();
    await server.start();
    
    console.log(`
🚀 Server running at: ${server.info.uri}
Environment: ${process.env.NODE_ENV || 'development'}
PID: ${process.pid}
    `);

  } catch (err) {
    console.error('💥 Server failed to start:', err.message);
    console.error(err.stack);
    process.exit(1);
  }
}

// Iniciar solo si es el módulo principal
if (require.main === module) {
  start();
}

module.exports = { createServer };