/**
 * Database connection utility for server components
 */

import { connectToDatabase } from './db';

/**
 * Connect to the database
 * This function can be used in server components to ensure database connection
 */
export async function dbConnect() {
  try {
    await connectToDatabase();
  } catch (error) {
    console.error('Failed to connect to the database:', error);
    throw new Error('Database connection failed');
  }
}

/**
 * Middleware to ensure database connection
 */
export function withDb(handler: Function) {
  return async (...args: any[]) => {
    await dbConnect();
    return handler(...args);
  };
}