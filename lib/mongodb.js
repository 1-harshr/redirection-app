const { MongoClient } = require('mongodb');

const uri = process.env.MONGODB_URI;
const options = {};

let cachedClient = null;
let cachedDb = null;

if (!uri) {
    console.warn('⚠️  MONGODB_URI not set');
}

async function connectToDatabase() {
    if (cachedClient && cachedDb) {
        return { client: cachedClient, db: cachedDb };
    }

    if (!uri) {
        throw new Error('MONGODB_URI is not defined');
    }

    const client = new MongoClient(uri, options);
    await client.connect();
    const db = client.db('redirection-logs');

    cachedClient = client;
    cachedDb = db;

    console.log('✅ MongoDB connected (new connection established)');
    return { client, db };
}

module.exports = { connectToDatabase };
