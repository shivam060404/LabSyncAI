import { NextRequest, NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import { UserProfile } from '../../../../types';
import { getUsersCollection, toObjectId } from '../../../../lib/db';
import { dbConnect } from '../../../../lib/dbConnect';

export async function GET(request: NextRequest) {
  try {
    // Connect to the database
    await dbConnect();
    
    // Get session token from cookies
    const sessionToken = cookies().get('session_token')?.value;
    
    if (!sessionToken) {
      return NextResponse.json(
        { success: false, error: 'Not authenticated' },
        { status: 401 }
      );
    }
    
    // In a real app, you would verify the token and retrieve the user ID
    // For now, we'll extract the user ID from the token (assuming token is the user ID)
    const userId = sessionToken;
    
    // Get users collection
    const usersCollection = await getUsersCollection();
    
    // Find the user by ID
    try {
      const user = await usersCollection.findOne({ _id: toObjectId(userId) });
      
      if (!user) {
        return NextResponse.json(
          { success: false, error: 'User not found' },
          { status: 404 }
        );
      }
      
      // Convert MongoDB _id to string id for the response
      const { _id, password, ...userWithoutPassword } = user as any;
      
      return NextResponse.json({
        success: true,
        data: { id: _id.toString(), ...userWithoutPassword } as UserProfile,
        message: 'User retrieved successfully',
      });
    } catch (error) {
      console.error('Error finding user:', error);
      return NextResponse.json(
        { success: false, error: 'Invalid user ID' },
        { status: 400 }
      );
    }
  } catch (error) {
    console.error('Auth check error:', error);
    return NextResponse.json(
      { success: false, error: 'Internal server error' },
      { status: 500 }
    );
  }
}