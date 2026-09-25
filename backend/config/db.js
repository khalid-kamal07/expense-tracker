import mongoose from 'mongoose';

let connectionPromise = null;

export async function connectDB() {
  if (!process.env.MONGO_URI) throw new Error('MONGO_URI is missing');

  if (mongoose.connection.readyState === 1) {
    return mongoose.connection;
  }

  if (!connectionPromise) {
    connectionPromise = mongoose
      .connect(process.env.MONGO_URI, {
        maxPoolSize: 5,
        serverSelectionTimeoutMS: 10000,
      })
      .then((conn) => {
        console.log('MongoDB connected');
        return conn;
      })
      .catch((err) => {
        connectionPromise = null; // allow retry on next invocation
        throw err;
      });
  }

  return connectionPromise;
}