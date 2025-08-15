const Joi = require('joi');
const { Boom } = require('@hapi/boom');
const UserService = require('../services/user.service');

exports.plugin = {
  name: 'user-routes',
  version: '1.0.0',
  register: async (server) => {
    const userService = new UserService(server.app.db);
    server.method('getUserService', () => userService);

    server.route([
      {
        method: 'POST',
        path: '/users/register',
        options: {
          auth: false,
          validate: {
            payload: Joi.object({
              email: Joi.string().email().required(),
              password: Joi.string().min(8).required()
            })
          },
          tags: ['api', 'auth'],
          description: 'Register new user'
        },
        handler: async (request, h) => {
          try {
            const hashedPass = await server.methods.hashPassword(request.payload.password);
            const user = await userService.create({
              email: request.payload.email,
              password: hashedPass
            });
            
            return h.response({
              success: true,
              data: user
            }).code(201);
          } catch (error) {
            if (error.isBoom) throw error;
            throw Boom.badImplementation(error.message);
          }
        }
      },
      {
        method: 'POST',
        path: '/users/login',
        options: {
          auth: false,
          validate: {
            payload: Joi.object({
              email: Joi.string().email().required(),
              password: Joi.string().required()
            })
          },
          tags: ['api', 'auth'],
          description: 'User login'
        },
        handler: async (request, h) => {
          try {
            const { email, password } = request.payload;
            const user = await userService.login(email, password);
            
            const token = server.methods.generateToken({
              id: user._id,
              email: user.email
            });
            
            return {
              success: true,
              token,
              user
            };
          } catch (error) {
            if (error.isBoom) throw error;
            throw Boom.unauthorized('Invalid credentials');
          }
        }
      }
    ]);
  }
};