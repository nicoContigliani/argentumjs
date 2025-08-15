const { Boom } = require('@hapi/boom');

exports.plugin = {
  name: 'error-handler',
  once: true,
  register: async (server) => {
    server.ext('onPreResponse', (request, h) => {
      const response = request.response;
      
      if (response.isBoom) {
        const statusCode = response.output.statusCode;
        
        // Personalizar mensajes de error
        if (statusCode === 401) {
          response.output.payload.message = 'Invalid credentials';
        }
        
        return h.response({
          statusCode,
          error: response.output.payload.error,
          message: response.output.payload.message,
          ...(process.env.NODE_ENV !== 'production' && { stack: response.stack })
        }).code(statusCode);
      }
      
      return h.continue;
    });
  }
};