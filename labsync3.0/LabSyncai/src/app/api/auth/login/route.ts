import { NextRequest, NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import { UserProfile } from '../../../../types';
import { generateToken } from '../../../../utils/authUtils';
import { getUsersCollection } from '../../../../lib/db';
import { dbConnect } from '../../../../lib/dbConnect';
import { compare } from 'bcryptjs';

// Extended interface to include password for auth operations
interface UserWithPassword extends UserProfile {
  password: string;
}

export async function POST(request: NextRequest) {
  try {
    // Connect to the database
    await dbConnect();
    
    const body = await request.json();
    const { email, password } = body;

    // Validate input
    if (!email || !password) {
      return NextResponse.json(
        { success: false, error: 'Email and password are required' },
        { status: 400 }
      );
    }

    // Get users collection
    const usersCollection = await getUsersCollection();
    
    // Find user by email (case insensitive)
    const user = await usersCollection.findOne({
      email: { $regex: new RegExp(`^${email}$`, 'i') }
    }) as UserWithPassword | null;

    // Check if user exists
    if (!user) {
      return NextResponse.json(
        { success: false, error: 'Invalid email or password' },
        { status: 401 }
      );
    }
    
    // Check if password matches (using bcrypt compare)
    // For development, we'll also allow direct comparison if bcrypt hash is not used
    let passwordMatches = false;
    
    if (user.password.startsWith('$2')) {
      // It's a bcrypt hash, use compare
      passwordMatches = await compare(password, user.password);
    } else {
      // Direct comparison (for development only)
      passwordMatches = user.password === password;
    }
    
    if (!passwordMatches) {
      return NextResponse.json(
        { success: false, error: 'Invalid email or password' },
        { status: 401 }
      );
    }

    // Use the user's ID as the session token for simplicity
    // In a production app, you would generate a secure token and store it
    const sessionToken = user._id?.toString() ?? generateToken();

    // Set session cookie
    cookies().set({
      name: 'session_token',
      value: sessionToken,
      httpOnly: true,
      path: '/',
      secure: process.env.NODE_ENV === 'production',
      maxAge: 60 * 60 * 24 * 7, // 1 week
    });

    // Return user data (excluding password)
    const { _id, password: _, ...userWithoutPassword } = user;
    
    return NextResponse.json({
      success: true,
      data: { ...userWithoutPassword, id: _id?.toString() ?? '' } as UserProfile,
      message: 'Login successful',
    });
  } catch (error) {
    console.error('Login error:', error);
    return NextResponse.json(
      { success: false, error: 'Internal server error' },
      { status: 500 }
    );
  }
}