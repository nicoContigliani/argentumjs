const path = require('path');

async function registerPlugins(server, options) {
  // Registrar plugins requeridos
  for (const pluginPath of options.required || []) {
    try {
      const plugin = require(path.resolve(pluginPath));
      await server.register(plugin);
      console.log(`✅ Plugin required loaded: ${pluginPath}`);
    } catch (err) {
      console.error(`❌ Failed to load required plugin ${pluginPath}:`, err);
      throw err;
    }
  }

  // Registrar plugins opcionales
  for (const [feature, pluginPath] of Object.entries(options.optional || {})) {
    if (server.app.config.features[feature]?.active !== false) {
      try {
        const plugin = require(path.resolve(pluginPath));
        await server.register(plugin);
        console.log(`✅ Optional plugin loaded: ${feature}`);
      } catch (err) {
        console.error(`⚠️ Failed to load optional plugin ${feature}:`, err.message);
        if (server.app.config.env === 'production') {
          throw err;
        }
      }
    }
  }
}

module.exports = { registerPlugins };