import { NextRequest, NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import { UserProfile } from '../../../../types';
import { getUsersCollection, toObjectId } from '../../../../lib/db';
import { dbConnect } from '../../../../lib/dbConnect';

export async function PATCH(request: NextRequest) {
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
    
    // Get the request body
    const body = await request.json();
    
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
      
      // Update user data
      // Only update fields that are provided and allowed to be updated
      const allowedFields = [
        'name',
        'age',
        'gender',
        'location',
        'region',
        'state',
        'bloodType',
        'height',
        'weight',
        'allergies',
        'conditions',
        'medications',
        'emergencyContact',
        'languagePreference',
        'smsNotificationSettings',
        'compressionSettings',
      ];
      
      const updateData: Record<string, any> = {};
      
      for (const field of allowedFields) {
        if (field in body && body[field] !== undefined) {
          updateData[field] = body[field];
        }
      }
      
      // Only update if there are changes
      if (Object.keys(updateData).length > 0) {
        // Add updated timestamp
        updateData.updatedAt = new Date();
        
        // Update the user in the database
        await usersCollection.updateOne(
          { _id: toObjectId(userId) },
          { $set: updateData }
        );
        
        // Get the updated user
        const updatedUser = await usersCollection.findOne({ _id: toObjectId(userId) });
        
        // Convert MongoDB _id to string id for the response
        const { _id, password, ...userWithoutPassword } = updatedUser as any;
        
        return NextResponse.json({
          success: true,
          data: { id: _id.toString(), ...userWithoutPassword } as UserProfile,
          message: 'Profile updated successfully',
        });
      } else {
        // No changes were made
        // Convert MongoDB _id to string id for the response
        const { _id, password, ...userWithoutPassword } = user as any;
        
        return NextResponse.json({
          success: true,
          data: { id: _id.toString(), ...userWithoutPassword } as UserProfile,
          message: 'No changes were made to the profile',
        });
      }
    } catch (error) {
      console.error('Error finding/updating user:', error);
      return NextResponse.json(
        { success: false, error: 'Invalid user ID' },
        { status: 400 }
      );
    }
  } catch (error) {
    console.error('Profile update error:', error);
    return NextResponse.json(
      { success: false, error: 'Internal server error' },
      { status: 500 }
    );
  }
}