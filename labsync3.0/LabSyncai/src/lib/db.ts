/**
 * MongoDB database connection and utilities
 */

import { MongoClient, Db, Collection, ObjectId, Document } from 'mongodb';
import { MedicalReport, UserProfile } from '../types';

// Connection URL from environment variables
const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://localhost:27017';
const MONGODB_DB = process.env.MONGODB_DB || 'labsyncai';

// Connection cache
let cachedClient: MongoClient | null = null;
let cachedDb: Db | null = null;

/**
 * Connect to MongoDB
 */
export async function connectToDatabase(): Promise<{ client: MongoClient; db: Db }> {
  // If we have a cached connection, use it
  if (cachedClient && cachedDb) {
    return { client: cachedClient, db: cachedDb };
  }

  // Otherwise create a new connection
  if (!MONGODB_URI) {
    throw new Error('Please define the MONGODB_URI environment variable');
  }

  if (!MONGODB_DB) {
    throw new Error('Please define the MONGODB_DB environment variable');
  }

  const client = new MongoClient(MONGODB_URI);
  await client.connect();
  const db = client.db(MONGODB_DB);

  // Cache the connection
  cachedClient = client;
  cachedDb = db;

  return { client, db };
}

/**
 * Get a collection with proper typing
 */
export async function getCollection<T extends Document>(collectionName: string): Promise<Collection<T>> {
  const { db } = await connectToDatabase();
  return db.collection<T>(collectionName);
}

/**
 * Get the reports collection
 */
export async function getReportsCollection(): Promise<Collection<MedicalReport>> {
  return getCollection<MedicalReport>('reports');
}

/**
 * Get the users collection
 */
export async function getUsersCollection(): Promise<Collection<UserProfile>> {
  return getCollection<UserProfile>('users');
}

/**
 * Convert string ID to MongoDB ObjectId
 */
export function toObjectId(id: string): ObjectId {
  try {
    return new ObjectId(id);
  } catch (error) {
    throw new Error(`Invalid ObjectId: ${id}`);
  }
}

/**
 * Convert MongoDB ObjectId to string
 */
export function fromObjectId(id: ObjectId): string {
  return id.toString();
}

/**
 * Initialize database with required collections and indexes
 */
export async function initializeDatabase(): Promise<void> {
  const { db } = await connectToDatabase();
  
  // Create collections if they don't exist
  const collections = await db.listCollections().toArray();
  const collectionNames = collections.map(c => c.name);
  
  if (!collectionNames.includes('reports')) {
    await db.createCollection('reports');
  }
  
  if (!collectionNames.includes('users')) {
    await db.createCollection('users');
  }
  
  if (!collectionNames.includes('health_plans')) {
    await db.createCollection('health_plans');
  }
  
  if (!collectionNames.includes('recommendations')) {
    await db.createCollection('recommendations');
  }
  
  // Create indexes
  await db.collection('reports').createIndex({ userId: 1 });
  await db.collection('reports').createIndex({ type: 1 });
  await db.collection('reports').createIndex({ status: 1 });
  await db.collection('reports').createIndex({ uploadDate: -1 });
  
  await db.collection('users').createIndex({ email: 1 }, { unique: true });
  
  await db.collection('health_plans').createIndex({ userId: 1 });
  await db.collection('health_plans').createIndex({ reportId: 1 });
  
  await db.collection('recommendations').createIndex({ userId: 1 });
  
  console.log('Database initialized successfully');
}