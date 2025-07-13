/**
 * Database initialization script
 */

import { initializeDatabase } from './db';
import { MOCK_USERS } from '../utils/mockData';
import { MOCK_REPORTS } from '../utils/mockReports';
import { getUsersCollection, getReportsCollection } from './db';

/**
 * Initialize the database with collections, indexes, and seed data
 */
export async function initDb() {
  try {
    console.log('Initializing database...');
    
    // Initialize database structure
    await initializeDatabase();
    
    // Seed data if collections are empty
    await seedUsers();
    await seedReports();
    
    console.log('Database initialization complete');
  } catch (error) {
    console.error('Database initialization failed:', error);
  }
}

/**
 * Seed users collection if empty
 */
async function seedUsers() {
  const usersCollection = await getUsersCollection();
  const count = await usersCollection.countDocuments();
  
  if (count === 0) {
    console.log('Seeding users collection...');
    
    // Convert mock users to MongoDB format
    const users = MOCK_USERS.map(user => ({
      ...user,
      createdAt: new Date(user.createdAt),
      updatedAt: new Date(user.updatedAt)
    }));
    
    await usersCollection.insertMany(users);
    console.log(`Inserted ${users.length} users`);
  } else {
    console.log(`Users collection already has ${count} documents, skipping seed`);
  }
}

/**
 * Seed reports collection if empty
 */
async function seedReports() {
  const reportsCollection = await getReportsCollection();
  const count = await reportsCollection.countDocuments();
  
  if (count === 0) {
    console.log('Seeding reports collection...');
    
    // Convert mock reports to MongoDB format
    const reports = MOCK_REPORTS.map(report => ({
      ...report,
      uploadDate: new Date(report.uploadDate),
      processedDate: report.processedDate ? new Date(report.processedDate) : undefined,
      createdAt: new Date(report.createdAt),
      updatedAt: new Date(report.updatedAt)
    }));
    
    await reportsCollection.insertMany(reports);
    console.log(`Inserted ${reports.length} reports`);
  } else {
    console.log(`Reports collection already has ${count} documents, skipping seed`);
  }
}