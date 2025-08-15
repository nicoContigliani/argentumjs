const convict = require('convict');
require('dotenv').config();

const config = convict({
  env: {
    doc: 'Application environment',
    format: ['production', 'development', 'test'],
    default: 'development',
    env: 'NODE_ENV'
  },
  features: {
    db: {
      active: { format: Boolean, default: true },
      type: { format: ['relational', 'document'], default: 'document' },
      orm: { format: ['mongoose', 'sequelize'], default: 'mongoose' },
      connection: { format: String, default: process.env.MONGO_URI }
    },
    auth: {
      active: { format: Boolean, default: true },
      jwt: {
        secret: { format: String, default: process.env.JWT_SECRET },
        expiresIn: { format: String, default: process.env.JWT_EXPIRES_IN }
      }
    },
    swagger: {
      active: { format: Boolean, default: true },
      route: { format: String, default: '/docs' }
    },
    sockets: {
      active: { format: Boolean, default: false }
    }
  }
});

config.loadFile('./app.json');
config.validate();

module.exports = { loadConfig: () => config.getProperties() };