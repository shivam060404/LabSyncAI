# MongoDB Integration Guide

## Overview

LabSync AI uses MongoDB as its primary database. This document provides information about the MongoDB integration, including setup, schema, and usage.

## Setup

### Connection

The application connects to MongoDB using the connection string specified in the `.env.local` file:

```
MONGODB_URI=mongodb+srv://yourusername:yourpassword@yourcluster.mongodb.net/?retryWrites=true&w=majority
MONGODB_DB=labsyncai
```

For local development, you can use a local MongoDB instance:

```
MONGODB_URI=mongodb://localhost:27017
MONGODB_DB=labsyncai
```

### Initialization

To initialize the database with the required collections and indexes, run:

```bash
npm run init-db
# or
yarn init-db
```

This script will:
1. Create the necessary collections if they don't exist
2. Set up indexes for efficient queries
3. Create a test user if one doesn't exist

### Testing Connection

To test the MongoDB connection, run:

```bash
npm run test-db
# or
yarn test-db
```

## Database Schema

### Collections

- **users**: Stores user profiles and authentication information
- **reports**: Stores medical reports uploaded by users
- **health_plans**: Stores personalized health plans generated for users
- **recommendations**: Stores health recommendations based on user reports

### Indexes

#### Users Collection
- `email`: Unique index for user lookup by email

#### Reports Collection
- `userId`: Index for finding reports by user
- `type`: Index for filtering reports by type
- `status`: Index for filtering reports by status
- `uploadDate`: Index for sorting reports by date

#### Health Plans Collection
- `userId`: Index for finding health plans by user
- `reportId`: Index for finding health plans related to specific reports

#### Recommendations Collection
- `userId`: Index for finding recommendations by user

## Usage in Code

### Connecting to the Database

```typescript
import { connectToDatabase } from '../lib/db';

async function example() {
  const { client, db } = await connectToDatabase();
  // Use the database
}
```

### Accessing Collections

```typescript
import { getUsersCollection, getReportsCollection } from '../lib/db';

async function example() {
  const usersCollection = await getUsersCollection();
  const reportsCollection = await getReportsCollection();
  
  // Query collections
  const user = await usersCollection.findOne({ email: 'example@example.com' });
  const reports = await reportsCollection.find({ userId: user._id }).toArray();
}
```

### Working with ObjectIds

```typescript
import { toObjectId, fromObjectId } from '../lib/db';

async function example() {
  // Convert string ID to ObjectId
  const objectId = toObjectId('507f1f77bcf86cd799439011');
  
  // Convert ObjectId to string
  const stringId = fromObjectId(objectId);
}
```

## Authentication Flow

1. **Signup**: User data is stored in the `users` collection with a hashed password
2. **Login**: User credentials are verified against the `users` collection
3. **Session**: The user's MongoDB ObjectId is used as the session token
4. **Profile**: User profile data is retrieved from and updated in the `users` collection

## Best Practices

1. Always use the utility functions in `lib/db.ts` to access the database
2. Use proper error handling when interacting with the database
3. Keep sensitive data (like passwords) secure by excluding them from query results
4. Use the MongoDB aggregation pipeline for complex queries
5. Use transactions for operations that modify multiple documents