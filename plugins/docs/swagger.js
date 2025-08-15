// En plugins/docs/swagger.js
const Inert = require('@hapi/inert');
const Vision = require('@hapi/vision');
const HapiSwagger = require('hapi-swagger');

exports.plugin = {
  name: 'swagger-docs',
  register: async (server) => {
    await server.register([
      Inert,
      Vision,
      {
        plugin: HapiSwagger,
        options: {
          info: {
            title: 'ArgentumJS API',
            version: '1.0'
          }
        }
      }
    ]);
  }
};