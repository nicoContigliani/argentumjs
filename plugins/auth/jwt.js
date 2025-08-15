const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');

exports.plugin = {
  name: 'jwt-auth',
  once: true,
  register: async (server) => {
    const config = server.app.config.features.auth.jwt;

    // Helper methods
    server.method('hashPassword', async (password) => {
      return bcrypt.hash(password, 10);
    });

    server.method('generateToken', (payload) => {
      return jwt.sign(payload, config.secret, { 
        expiresIn: config.expiresIn 
      });
    });

    // JWT Strategy
    await server.register(require('hapi-auth-jwt2'));

    server.auth.strategy('jwt', 'jwt', {
      key: config.secret,
      validate: async (decoded) => ({ isValid: true, credentials: decoded }),
      verifyOptions: { algorithms: ['HS256'] }
    });

    server.auth.default('jwt');
  }
};