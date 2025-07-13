/**
 * Database initialization script
 * 
 * This script initializes the MongoDB database with required collections and indexes.
 * It also creates a test user if one doesn't exist.
 */

import { initializeDatabase, getUsersCollection } from '../lib/db';
import { hash } from 'bcryptjs';

async function main() {
  try {
    console.log('Initializing database...');
    await initializeDatabase();
    
    // Create a test user if one doesn't exist
    const usersCollection = await getUsersCollection();
    const testUserEmail = 'test@example.com';
    
    const existingUser = await usersCollection.findOne({ 
      email: { $regex: new RegExp(`^${testUserEmail}$`, 'i') } 
    });
    
    if (!existingUser) {
      console.log('Creating test user...');
      const hashedPassword = await hash('Test@123', 10);
      
      const now = new Date();
      const testUser = {
        name: 'Test User',
        email: testUserEmail,
        password: hashedPassword,
        gender: 'prefer-not-to-say',
        location: 'Mumbai',
        conditions: ['Hypertension'],
        allergies: ['Peanuts'],
        medications: ['Lisinopril'],
        createdAt: now,
        updatedAt: now,
      };
      
      const result = await usersCollection.insertOne({ 
        ...testUser,
        id: new Date().getTime().toString(),
        gender: 'prefer-not-to-say' as const
      });
      if (result.acknowledged) {
        console.log(`Test user created with ID: ${result.insertedId}`);
      }
    } else {
      console.log('Test user already exists');
    }
    
    console.log('Database initialization completed successfully');
  } catch (error) {
    console.error('Database initialization failed:', error);
    process.exit(1);
  } finally {
    process.exit(0);
  }
}

// Run the initialization
main();