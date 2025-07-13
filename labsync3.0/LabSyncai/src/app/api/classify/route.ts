import { NextRequest, NextResponse } from 'next/server';
import { GroqAIService, ReportType } from '@/lib/aiService';

// Initialize the AI service
const aiService = new GroqAIService();

/**
 * POST handler for /api/classify
 * Automatically classifies the type of medical report based on its content
 */
export async function POST(request: NextRequest) {
  try {
    // Parse the form data or JSON
    let fileContent: string = '';
    let fileName: string = '';
    
    // Check if the request is multipart/form-data or application/json
    const contentType = request.headers.get('content-type') || '';
    
    if (contentType.includes('multipart/form-data')) {
      // Handle form data with file upload
      const formData = await request.formData();
      const file = formData.get('file') as File | null;
      
      if (!file) {
        return NextResponse.json(
          { success: false, message: 'File is required' },
          { status: 400 }
        );
      }
      
      // Extract file content and name
      fileContent = await file.text();
      fileName = file.name;
    } else {
      // Handle JSON request
      const body = await request.json();
      fileContent = body.content;
      fileName = body.fileName || 'unknown.txt';
      
      if (!fileContent) {
        return NextResponse.json(
          { success: false, message: 'Content is required' },
          { status: 400 }
        );
      }
    }
    
    // Classify the report type using AI
    const reportType: ReportType = await aiService.classifyReportType(fileContent);
    
    // Return the classification result
    return NextResponse.json({
      success: true,
      data: {
        reportType,
        confidence: 0.85, // In a real implementation, this would come from the AI service
        possibleAlternatives: [] // In a real implementation, this would include other possible types
      }
    });
  } catch (error) {
    console.error('Error classifying report:', error);
    return NextResponse.json(
      { success: false, message: 'Failed to classify report' },
      { status: 500 }
    );
  }
}