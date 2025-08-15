const mongoose = require('mongoose');

exports.plugin = {
  name: 'mongoose-db',
  once: true,
  register: async (server) => {
    try {
      await mongoose.connect(process.env.MONGO_URI || 'mongodb://localhost:27017/argentumjs', {
        serverSelectionTimeoutMS: 5000
      });
      
      server.app.db = mongoose;
      server.expose('mongoose', mongoose);
      
      mongoose.connection.on('connected', () => {
        console.log('✅ MongoDB connected');
      });
      
      mongoose.connection.on('error', (err) => {
        console.error('❌ MongoDB connection error:', err);
      });

    } catch (err) {
      console.error('❌ MongoDB initial connection failed:', err);
      throw err;
    }
  }
};