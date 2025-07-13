/**
 * Mock data for development and testing
 */

// Mock user database - in a real app, this would be a database
export const MOCK_USERS = [
  {
    id: '1',
    name: 'Test User',
    email: 'test@example.com',
    password: 'Password123', // In a real app, this would be hashed
    age: 30,
    gender: 'male' as 'male' | 'female' | 'other' | 'prefer-not-to-say',
    location: 'New York',
    conditions: ['Diabetes'],
    profileCompleted: true,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
];