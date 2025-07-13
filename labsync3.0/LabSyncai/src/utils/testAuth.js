/**
 * Test script for authentication system
 * 
 * This script tests the authentication flow:
 * 1. Signup a new user
 * 2. Login with the new user
 * 3. Get the user profile
 * 4. Update the user profile
 * 5. Logout
 * 
 * To run this script:
 * 1. Start the development server: npm run dev
 * 2. Open a new terminal and run: node src/utils/testAuth.js
 */

async function testAuth() {
  const baseUrl = 'http://localhost:3000/api';
  let cookies = '';
  
  console.log('🧪 Starting authentication system test...');
  
  // Generate a unique email for testing
  const testEmail = `test${Date.now()}@example.com`;
  const testPassword = 'TestPassword123!';
  const testName = 'Test User';
  
  // Step 1: Signup
  console.log('\n📝 Testing signup...');
  try {
    const signupResponse = await fetch(`${baseUrl}/auth/signup`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        name: testName,
        email: testEmail,
        password: testPassword,
      }),
    });
    
    // Save cookies for subsequent requests
    if (signupResponse.headers.get('set-cookie')) {
      cookies = signupResponse.headers.get('set-cookie');
    }
    
    const signupData = await signupResponse.json();
    console.log('Signup response:', signupData);
    
    if (!signupData.success) {
      throw new Error(`Signup failed: ${signupData.error || 'Unknown error'}`);
    }
    
    console.log('✅ Signup successful');
  } catch (error) {
    console.error('❌ Signup test failed:', error.message);
    return;
  }
  
  // Step 2: Login
  console.log('\n🔑 Testing login...');
  try {
    const loginResponse = await fetch(`${baseUrl}/auth/login`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Cookie: cookies,
      },
      body: JSON.stringify({
        email: testEmail,
        password: testPassword,
      }),
    });
    
    // Update cookies
    if (loginResponse.headers.get('set-cookie')) {
      cookies = loginResponse.headers.get('set-cookie');
    }
    
    const loginData = await loginResponse.json();
    console.log('Login response:', loginData);
    
    if (!loginData.success) {
      throw new Error(`Login failed: ${loginData.error || 'Unknown error'}`);
    }
    
    console.log('✅ Login successful');
  } catch (error) {
    console.error('❌ Login test failed:', error.message);
    return;
  }
  
  // Step 3: Get user profile
  console.log('\n👤 Testing get user profile...');
  try {
    const profileResponse = await fetch(`${baseUrl}/auth/me`, {
      method: 'GET',
      headers: {
        Cookie: cookies,
      },
    });
    
    const profileData = await profileResponse.json();
    console.log('Profile response:', profileData);
    
    if (!profileData.success) {
      throw new Error(`Get profile failed: ${profileData.error || 'Unknown error'}`);
    }
    
    console.log('✅ Get profile successful');
  } catch (error) {
    console.error('❌ Get profile test failed:', error.message);
    return;
  }
  
  // Step 4: Update user profile
  console.log('\n✏️ Testing update user profile...');
  try {
    const updateResponse = await fetch(`${baseUrl}/auth/profile`, {
      method: 'PATCH',
      headers: {
        'Content-Type': 'application/json',
        Cookie: cookies,
      },
      body: JSON.stringify({
        age: 25,
        location: 'San Francisco',
        bloodType: 'O+',
      }),
    });
    
    const updateData = await updateResponse.json();
    console.log('Update profile response:', updateData);
    
    if (!updateData.success) {
      throw new Error(`Update profile failed: ${updateData.error || 'Unknown error'}`);
    }
    
    console.log('✅ Update profile successful');
  } catch (error) {
    console.error('❌ Update profile test failed:', error.message);
    return;
  }
  
  // Step 5: Logout
  console.log('\n🚪 Testing logout...');
  try {
    const logoutResponse = await fetch(`${baseUrl}/auth/logout`, {
      method: 'POST',
      headers: {
        Cookie: cookies,
      },
    });
    
    const logoutData = await logoutResponse.json();
    console.log('Logout response:', logoutData);
    
    if (!logoutData.success) {
      throw new Error(`Logout failed: ${logoutData.error || 'Unknown error'}`);
    }
    
    console.log('✅ Logout successful');
  } catch (error) {
    console.error('❌ Logout test failed:', error.message);
    return;
  }
  
  console.log('\n🎉 All authentication tests passed successfully!');
}

testAuth().catch(error => {
  console.error('Test failed with error:', error);
});