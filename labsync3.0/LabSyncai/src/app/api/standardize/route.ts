import { NextRequest, NextResponse } from 'next/server';
import aiService, { ReportType } from '../../../lib/aiService';

// Using the imported AI service instance

/**
 * POST handler for /api/standardize
 * Standardizes different report formats into a consistent structure
 */
export async function POST(request: NextRequest) {
  try {
    // Parse the request
    let fileContent: string = '';
    let fileName: string = '';
    let reportType: ReportType | null = null;
    
    // Check if the request is multipart/form-data or application/json
    const contentType = request.headers.get('content-type') || '';
    
    if (contentType.includes('multipart/form-data')) {
      // Handle form data with file upload
      const formData = await request.formData();
      const file = formData.get('file') as File | null;
      reportType = formData.get('reportType') as string as ReportType | null; // Convert string to ReportType enum
      
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
      reportType = body.reportType || null;
      
      if (!fileContent) {
        return NextResponse.json(
          { success: false, message: 'Content is required' },
          { status: 400 }
        );
      }
    }
    
    // If report type is not provided, try to classify it
    if (!reportType) {
      try {
        reportType = await aiService.classifyReportType(fileContent);
      } catch (classificationError) {
        console.error('Error classifying report type:', classificationError);
        // Default to 'OTHER' if classification fails
        reportType = ReportType.OTHER;
      }
    }
    
    // Create a basic data structure from the extracted text
    const basicData = {
      text: fileContent,
      fileName: fileName,
      extractedDate: new Date().toISOString()
    };
    
    // Standardize the report format using AI
    const standardizedData = await aiService.standardizeReportFormat(basicData, reportType);
    
    // Return the standardized data
    return NextResponse.json({
      success: true,
      data: {
        standardizedData,
        reportType,
        originalFileName: fileName
      }
    });
  } catch (error) {
    console.error('Error standardizing report:', error);
    return NextResponse.json(
      { success: false, message: 'Failed to standardize report' },
      { status: 500 }
    );
  }
}