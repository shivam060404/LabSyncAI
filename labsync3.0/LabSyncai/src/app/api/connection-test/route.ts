import { NextResponse } from 'next/server';

/**
 * Simple API route to test connection speed
 * Returns a small payload (1KB of data) for measuring download speed
 */
export async function GET() {
  // Generate a 1KB string (approximately)
  const payload = 'x'.repeat(1024);
  
  return NextResponse.json({ 
    status: 'success',
    message: 'Connection test successful',
    timestamp: new Date().toISOString(),
    payload
  });
}