import mongoose from 'mongoose';

let connectionManager = global.connectionManager;

if (!connectionManager) {
  connectionManager = global.connectionManager = {};
}

async function connectToDatabase(environment = 'local') {
  const dbUri = environment === 'prod' ? process.env.MONGODB_URI : process.env.MONGODB_URI_LOCAL;

  if (!connectionManager[environment]) {
    const opts = {
      bufferCommands: true,
    };

    connectionManager[environment] =  mongoose.createConnection(dbUri, opts);

    connectionManager[environment].on('connected', () => {
      console.log(`Connected to MongoDB: ${environment} `);
    });

    connectionManager[environment].on('error', (error) => {
      console.error(`MongoDB connection error for ${environment}:`, error);
    });
  }

  return connectionManager[environment];
}

export default connectToDatabase;
