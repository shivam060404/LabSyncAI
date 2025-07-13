import { NextRequest, NextResponse } from 'next/server';
import { GroqAIService, ReportType } from '../../../lib/aiService';
import { FileType } from '../../../lib/fileProcessing';

// Initialize the AI service
const aiService = new GroqAIService();

// Function to dynamically load Tesseract.js
async function loadTesseract() {
  try {
    // Dynamically import Tesseract.js only when needed
    const { createWorker } = await import('tesseract.js');
    // Create worker with English language directly and logger
    // In Tesseract.js v5+, language and logger are specified during worker creation
    const worker = await createWorker('eng', 1, {
      logger: m => console.debug(m) // Use debug level to reduce console noise
    });
    return worker;
  } catch (error) {
    console.error('Failed to load Tesseract.js:', error);
    throw new Error('OCR service unavailable: ' + (error instanceof Error ? error.message : String(error)));
  }
}

// Function to safely terminate a Tesseract worker
async function safeTerminateWorker(worker: any) {
  if (!worker) return;
  
  try {
    await worker.terminate();
    console.log('Tesseract worker terminated successfully');
  } catch (terminateError) {
    console.warn('Error terminating Tesseract worker:', terminateError);
    // Continue execution even if termination fails
  }
}

export async function POST(request: NextRequest) {
  try {
    // Parse the form data (multipart/form-data)
    const formData = await request.formData();
    
    // Get the image file
    const imageFile = formData.get('image') as File | null;
    const reportType = formData.get('reportType') as string | null;
    const analysisType = formData.get('analysisType') as string | null || 'general';
    
    // Validate the request
    if (!imageFile) {
      return NextResponse.json(
        { success: false, message: 'Image file is required' },
        { status: 400 }
      );
    }
    
    // Read the image file as an ArrayBuffer
    const imageBuffer = await imageFile.arrayBuffer();
    const buffer = Buffer.from(imageBuffer);
    const imageBase64 = buffer.toString('base64');
    
    // Process the image with the appropriate service
    let analysisResult;
    
    if (reportType === 'ocr') {
      let tesseract = null;
      try {
        // Use Tesseract.js for OCR (free and runs locally)
        tesseract = await loadTesseract();
        
        // Create a Blob from the buffer
        const blob = new Blob([buffer], { type: imageFile.type });
        
        // Perform OCR using Tesseract.js
        // In Tesseract.js v5+, logger is set during worker creation, not in recognize
        const { data: { text } } = await tesseract.recognize(blob);
        
        // Extract the text from the result
        analysisResult = text;
      } catch (ocrError) {
        console.error('Error with Tesseract OCR:', ocrError);
        // Fall back to Gemini API if Tesseract fails
        analysisResult = await aiService.extractTextFromImage(buffer);
      } finally {
        // Ensure worker is terminated to free resources using the safe termination function
        await safeTerminateWorker(tesseract);
      }
    } else {
      // Determine the report type if not provided
      let effectiveReportType: ReportType = reportType as string as ReportType || ReportType.OTHER; // Convert string to ReportType enum
      
      // Extract text for classification if needed
      let extractedText = '';
      if (effectiveReportType === ReportType.OTHER || reportType === 'auto-detect') {
        let tesseract = null;
        try {
          // Try to use Tesseract for OCR first
          tesseract = await loadTesseract();
          const blob = new Blob([buffer], { type: imageFile.type });
          const { data: { text } } = await tesseract.recognize(blob);
          extractedText = text;
          
          // Classify the report type using the extracted text
          effectiveReportType = await aiService.classifyReportType(extractedText);
          console.log(`Report type classified as: ${effectiveReportType}`);
        } catch (classificationError) {
          console.error('Error classifying image type:', classificationError);
          // Try to use aiService.extractTextFromImage as a fallback for OCR
          try {
            extractedText = await aiService.extractTextFromImage(buffer);
            effectiveReportType = await aiService.classifyReportType(extractedText);
            console.log(`Report type classified using fallback OCR: ${effectiveReportType}`);
          } catch (fallbackError) {
            console.error('Fallback OCR and classification failed:', fallbackError);
            // Fall back to 'OTHER' if all classification attempts fail
            effectiveReportType = ReportType.OTHER;
          }
        } finally {
          // Ensure worker is terminated to free resources using the safe termination function
          await safeTerminateWorker(tesseract);
        }
      }
      
      // Use Gemini API for image analysis (with fallback to simulated analysis if needed)
      try {
        // Analyze the image based on analysis type
        switch (analysisType.toLowerCase()) {
          case 'detailed':
            // Perform detailed analysis with higher confidence threshold
            analysisResult = await aiService.analyzeImage(buffer, effectiveReportType, { analysisType: 'detailed' });
            break;
            
          case 'quick':
            // Perform quick analysis with lower confidence threshold
            analysisResult = await aiService.analyzeImage(buffer, effectiveReportType, { analysisType: 'quick' });
            break;
            
          default:
            // Standard analysis
            analysisResult = await aiService.analyzeImage(buffer, effectiveReportType, { analysisType: 'standard' });
        }
      } catch (analysisError) {
        console.error('Error with Gemini image analysis:', analysisError);
        
        // Provide a fallback analysis if the AI service fails
        analysisResult = {
          summary: 'Image analysis processed locally.',
          findings: extractedText ? ['Text extracted from image', extractedText.substring(0, 200) + (extractedText.length > 200 ? '...' : '')] : ['No text could be extracted from this image'],
          recommendations: ['Please consult with a healthcare professional for proper interpretation of this image'],
          aiConfidenceScore: 0.5,
          reportType: effectiveReportType
        };
      }
    }
    
    // Return the response
    return NextResponse.json({
      success: true,
      data: analysisResult
    });
  } catch (error) {
    console.error('Error in image analysis:', error);
    return NextResponse.json(
      { success: false, message: 'Failed to analyze the image' },
      { status: 500 }
    );
  }
}