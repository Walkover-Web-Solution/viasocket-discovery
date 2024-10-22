// lib/dbConnect.js
import mongoose from 'mongoose';

const MONGODB_URI = process.env.MONGODB_URI;
const MONGODB_URI_LOCAL = process.env.MONGODB_URI_LOCAL;


let cachedConnections = global.cachedConnections;

if (!cachedConnections) {
  cachedConnections = global.cachedConnections = {};
}

async function dbConnect(environment) {
  let dbUri;

  if (environment === 'prod') {
    dbUri = MONGODB_URI;
  } else{
    environment = process.env.NEXT_PUBLIC_NEXT_API_ENVIRONMENT || 'local' ;
    dbUri = MONGODB_URI_LOCAL;
  }

  if (cachedConnections[environment]?.conn) {
    return cachedConnections[environment].conn;
  }

  if (!cachedConnections[environment]?.promise) {
    const opts = {
      useNewUrlParser: true,
      useUnifiedTopology: true,
      bufferCommands: false
    };

    const connection = mongoose.createConnection(dbUri, opts);

    cachedConnections[environment] = {
      promise: connection.asPromise(),
      conn: connection,
    };

    connection.on('connected', () => {
      console.log(`Connection established for environment: ${environment}`);
    });

    connection.on('disconnected', () => {
      console.log(`Connection disconnected for environment: ${environment}`);
  });

    connection.on('error', (error) => {
      console.error(`Connection error for environment: ${environment}`, error);
    });
  }

  cachedConnections[environment].conn = await cachedConnections[environment].promise;
  return cachedConnections[environment].conn;
}

export default dbConnect;
