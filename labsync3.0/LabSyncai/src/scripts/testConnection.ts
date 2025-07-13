/**
 * MongoDB connection test script
 * 
 * This script tests the connection to MongoDB and verifies that the database is properly configured.
 */

import { connectToDatabase, getUsersCollection } from '../lib/db';

async function main() {
  try {
    console.log('Testing MongoDB connection...');
    
    // Test database connection
    const { client, db } = await connectToDatabase();
    console.log('✅ Successfully connected to MongoDB');
    
    // Get database name
    const dbName = db.databaseName;
    console.log(`✅ Connected to database: ${dbName}`);
    
    // List collections
    const collections = await db.listCollections().toArray();
    console.log('✅ Available collections:');
    collections.forEach(collection => {
      console.log(`  - ${collection.name}`);
    });
    
    // Count users
    const usersCollection = await getUsersCollection();
    const userCount = await usersCollection.countDocuments();
    console.log(`✅ Number of users in the database: ${userCount}`);
    
    // Get a sample user (without password)
    if (userCount > 0) {
      const sampleUser = await usersCollection.findOne({}, { projection: { password: 0 } });
      console.log('✅ Sample user found:');
      console.log(JSON.stringify(sampleUser, null, 2));
    }
    
    console.log('\n✅ MongoDB connection test completed successfully');
  } catch (error) {
    console.error('❌ MongoDB connection test failed:', error);
    process.exit(1);
  } finally {
    process.exit(0);
  }
}

// Run the test
main();