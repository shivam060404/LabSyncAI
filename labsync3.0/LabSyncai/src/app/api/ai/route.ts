import { NextRequest, NextResponse } from 'next/server';
import { GroqAIService } from '../../../lib/aiService';

const aiService = new GroqAIService();

// Using the imported AI service instance

export async function POST(request: NextRequest) {
  try {
    // Parse the request body
    const body = await request.json();
    const { question, report, conversationHistory = [], patientContext = null } = body;
    
    // Validate the request
    if (!question) {
      return NextResponse.json(
        { success: false, message: 'Question is required' },
        { status: 400 }
      );
    }
    
    if (!report) {
      return NextResponse.json(
        { success: false, message: 'Report data is required' },
        { status: 400 }
      );
    }
    
    // Process the question with the AI service
    // Include conversation history and patient context for more context-aware responses
    const response = await aiService.answerQuestion(question, report, {
      conversationHistory,
      patientContext,
      includeReferences: true,  // Include references to specific parts of the report
      detailedExplanation: true // Provide more detailed explanations
    });
    
    // Return the enhanced response
    return NextResponse.json({
      success: true,
      data: {
        answer: response.answer,
        references: response.references || [],
        suggestedFollowUps: response.suggestedFollowUps || [],
        confidence: response.confidence || 0.95
      }
    });
  } catch (error) {
    console.error('Error in AI question processing:', error);
    return NextResponse.json(
      { success: false, message: 'Failed to process your question' },
      { status: 500 }
    );
  }
}