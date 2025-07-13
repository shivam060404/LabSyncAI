import { NextRequest, NextResponse } from 'next/server';
import aiService from '../../../lib/aiService';

// Using the imported AI service instance

/**
 * POST handler for /api/voice
 * Handles voice input (speech-to-text) and voice output (text-to-speech)
 */
export async function POST(request: NextRequest) {
  try {
    // Check if the request is multipart/form-data or application/json
    const contentType = request.headers.get('content-type') || '';
    
    if (contentType.includes('multipart/form-data')) {
      // Handle speech-to-text request (audio file upload)
      const formData = await request.formData();
      const audioFile = formData.get('audio') as File;
      
      if (!audioFile) {
        return NextResponse.json(
          { success: false, message: 'Audio file is required' },
          { status: 400 }
        );
      }
      
      // Convert the file to a buffer
      const arrayBuffer = await audioFile.arrayBuffer();
      const buffer = Buffer.from(arrayBuffer);
      
      // Process the audio with the AI service
      const text = await aiService.processVoiceInput(buffer);
      
      // Return the transcribed text
      return NextResponse.json({
        success: true,
        data: {
          text,
          confidence: 0.92 // Simulated confidence score
        }
      });
    } else {
      // Handle text-to-speech request (JSON payload)
      const body = await request.json();
      const { text, voiceOptions } = body;
      
      if (!text) {
        return NextResponse.json(
          { success: false, message: 'Text is required' },
          { status: 400 }
        );
      }
      
      // Generate voice response
      const audioBuffer = await aiService.generateVoiceResponse(text, voiceOptions);
      
      // Return the audio data
      // In a real implementation, we would return the audio buffer
      // For now, we'll return a success message
      return NextResponse.json({
        success: true,
        message: 'Voice response generated successfully',
        // In a real implementation, we would include the audio data
        // data: { audio: audioBuffer.toString('base64') }
      });
    }
  } catch (error) {
    console.error('Error processing voice request:', error);
    return NextResponse.json(
      { success: false, message: 'Failed to process voice request' },
      { status: 500 }
    );
  }
}