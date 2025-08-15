const { Boom } = require('@hapi/boom');
const User = require('../models/user.model');
const bcrypt = require('bcryptjs');

class UserService {
  constructor(db) {
    this.User = db?.model('User') || User;
  }

  async create(userData) {
    try {
      const user = new this.User(userData);
      await user.save();
      return this.sanitizeUser(user);
    } catch (err) {
      if (err.code === 11000) {
        throw Boom.conflict('Email already exists');
      }
      throw Boom.badImplementation(err.message);
    }
  }

  async findByEmail(email) {
    return this.User.findOne({ email }).select('+password');
  }

  async login(email, password) {
    const user = await this.findByEmail(email);
    if (!user) {
      throw Boom.unauthorized('Invalid credentials');
    }

    const validPassword = await bcrypt.compare(password, user.password);
    if (!validPassword) {
      throw Boom.unauthorized('Invalid credentials');
    }

    return this.sanitizeUser(user);
  }

  sanitizeUser(user) {
    const userObj = user.toObject();
    delete userObj.password;
    delete userObj.__v;
    return userObj;
  }
}

module.exports = UserService;