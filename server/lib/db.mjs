import { MongoClient } from 'mongodb';

let mongoClient = null;
let dbInstance = null;
let dbConnected = false;
let connectPromise = null;
let lastPingAtMs = 0;

function isDbConfigured() {
  return Boolean(process.env.MONGODB_URI && process.env.MONGODB_URI.trim());
}

export function getDbStatus() {
  return {
    dbConfigured: isDbConfigured(),
    dbConnected,
  };
}

export function markDbDisconnected() {
  dbConnected = false;
  lastPingAtMs = 0;
}

export async function getDb() {
  if (dbInstance && dbConnected) {
    return dbInstance;
  }

  if (!isDbConfigured()) {
    dbConnected = false;
    return null;
  }

  if (connectPromise) {
    return connectPromise;
  }

  connectPromise = (async () => {
    try {
      const client = new MongoClient(process.env.MONGODB_URI, {
        serverSelectionTimeoutMS: 5000,
        connectTimeoutMS: 5000,
      });
      await client.connect();
      const db = client.db();
      await db.command({ ping: 1 });

      mongoClient = client;
      dbInstance = db;
      dbConnected = true;
      console.log('[server:db] Connected to MongoDB.');
      return dbInstance;
    } catch {
      dbConnected = false;
      dbInstance = null;
      console.error('[server:db] Unable to connect to MongoDB. Check MONGODB_URI configuration.');
      return null;
    } finally {
      connectPromise = null;
    }
  })();

  return connectPromise;
}

export async function pingDb({ minIntervalMs = 60_000 } = {}) {
  if (!isDbConfigured()) {
    dbConnected = false;
    return { dbConfigured: false, dbConnected: false, pinged: false };
  }

  const now = Date.now();
  if (dbInstance && dbConnected && now - lastPingAtMs < minIntervalMs) {
    return { dbConfigured: true, dbConnected: true, pinged: false };
  }

  const db = await getDb();
  if (!db) {
    return { dbConfigured: true, dbConnected: false, pinged: false };
  }

  try {
    await db.command({ ping: 1 });
    dbConnected = true;
    lastPingAtMs = Date.now();
    return { dbConfigured: true, dbConnected: true, pinged: true };
  } catch {
    markDbDisconnected();
    return { dbConfigured: true, dbConnected: false, pinged: true };
  }
}

export async function closeDb() {
  dbConnected = false;
  dbInstance = null;
  lastPingAtMs = 0;
  if (mongoClient) {
    const clientToClose = mongoClient;
    mongoClient = null;
    await clientToClose.close().catch(() => {});
  }
}
