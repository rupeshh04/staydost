const mongoose = require('mongoose');

// Cached connection for serverless — reuse between warm invocations
let _connectionPromise = null;

const connectDB = () => {
  // Reuse existing open connection (warm Lambda / Vercel function)
  if (mongoose.connection.readyState === 1) return Promise.resolve();

  // Reuse in-flight promise (concurrent requests during cold start)
  if (_connectionPromise) return _connectionPromise;

  _connectionPromise = mongoose
    .connect(process.env.MONGODB_URI, {
      serverSelectionTimeoutMS: 10000,
      socketTimeoutMS: 45000,
    })
    .then((conn) => {
      console.log(`✅ MongoDB Connected: ${conn.connection.host}`);
      mongoose.connection.on('error', (err) => console.error('❌ MongoDB error:', err));
      mongoose.connection.on('disconnected', () => {
        console.warn('⚠️  MongoDB disconnected — will reconnect on next request');
        _connectionPromise = null;
      });
    })
    .catch((err) => {
      console.error('❌ Failed to connect to MongoDB:', err.message);
      _connectionPromise = null; // reset so next request retries
      throw err;
    });

  return _connectionPromise;
};

module.exports = { connectDB };
