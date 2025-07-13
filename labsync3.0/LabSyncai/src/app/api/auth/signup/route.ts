import { NextRequest, NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import { UserProfile } from '../../../../types';
import { isValidEmail, validatePassword } from '../../../../utils/authUtils';
import { getUsersCollection } from '../../../../lib/db';
import { dbConnect } from '../../../../lib/dbConnect';
import { hash } from 'bcryptjs';

// Extended interface for user creation without requiring id initially
interface UserCreationData extends Omit<UserProfile, 'id'> {
  password: string;
}

export async function POST(request: NextRequest) {
  try {
    // Connect to the database
    await dbConnect();
    
    const body = await request.json();
    const { name, email, password } = body;

    // Validate input
    if (!name || !email || !password) {
      return NextResponse.json(
        { success: false, error: 'Name, email, and password are required' },
        { status: 400 }
      );
    }

    // Validate email format
    if (!isValidEmail(email)) {
      return NextResponse.json(
        { success: false, error: 'Invalid email format' },
        { status: 400 }
      );
    }

    // Validate password strength
    const passwordValidation = validatePassword(password);
    if (!passwordValidation.isValid) {
      return NextResponse.json(
        { success: false, error: passwordValidation.message },
        { status: 400 }
      );
    }

    // Get users collection
    const usersCollection = await getUsersCollection();
    
    // Check if email already exists
    const existingUser = await usersCollection.findOne({
      email: { $regex: new RegExp(`^${email}$`, 'i') }
    });

    if (existingUser) {
      return NextResponse.json(
        { success: false, error: 'Email already in use' },
        { status: 409 }
      );
    }

    // Hash the password
    const hashedPassword = await hash(password, 10);

    // Create new user
    const now = new Date();
    const newUser: UserCreationData = {
      name,
      email,
      password: hashedPassword,
      gender: 'prefer-not-to-say' as 'male' | 'female' | 'other' | 'prefer-not-to-say',
      location: '',
      conditions: [],
      allergies: [],
      medications: [],
      createdAt: now,
      updatedAt: now,
    };

    // Insert the user into the database
    const result = await usersCollection.insertOne({ ...newUser, id: '' });
    
    if (!result.acknowledged || !result.insertedId) {
      return NextResponse.json(
        { success: false, error: 'Failed to create user' },
        { status: 500 }
      );
    }

    // Use the user's ID as the session token for simplicity
    const sessionToken = result.insertedId.toString();

    // Set session cookie
    cookies().set({
      name: 'session_token',
      value: sessionToken,
      httpOnly: true,
      path: '/',
      secure: process.env.NODE_ENV === 'production',
      maxAge: 60 * 60 * 24 * 7, // 1 week
    });

    // Get the created user (to ensure we have all fields)
    const createdUser = await usersCollection.findOne({ _id: result.insertedId }) as UserCreationData | null;
    
    if (!createdUser) {
      return NextResponse.json(
        { success: false, error: 'Failed to retrieve created user' },
        { status: 500 }
      );
    }
    
    // Return user data (excluding password)
    const { _id, password: _, ...userWithoutPassword } = createdUser;
    
    return NextResponse.json({
      success: true,
      data: { id: _id?.toString() ?? '', ...userWithoutPassword } as UserProfile,
      message: 'Account created successfully',
    });
  } catch (error) {
    console.error('Signup error:', error);
    return NextResponse.json(
      { success: false, error: 'Internal server error' },
      { status: 500 }
    );
  }
}