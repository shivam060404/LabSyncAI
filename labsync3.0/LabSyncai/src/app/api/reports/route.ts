import { NextRequest, NextResponse } from 'next/server';
import { MedicalReport, ReportFilters, PaginationParams, ReportType as ReportTypeString } from '../../../types';
import { getReportsCollection } from '../../../lib/db';
import { withDb } from '../../../lib/dbConnect';
import { ObjectId } from 'mongodb';
// Import ReportType enum directly to avoid circular dependency issues
import { ReportType as ReportTypeEnum } from '../../../lib/aiService';

// Helper function to convert between ReportType enum and string type
function convertReportType(type: ReportTypeEnum): ReportTypeString {
  switch (type) {
    case ReportTypeEnum.CBC:
      return 'CBC';
    case ReportTypeEnum.LIPID_PANEL:
      return 'Lipid Panel';
    case ReportTypeEnum.METABOLIC_PANEL:
      return 'Metabolic Panel';
    case ReportTypeEnum.URINALYSIS:
      return 'Urinalysis';
    case ReportTypeEnum.THYROID_PANEL:
      return 'Other'; // Map to 'Other' as there's no direct equivalent
    case ReportTypeEnum.IMAGING:
      return 'Other'; // Map to 'Other' as it could be any imaging type
    case ReportTypeEnum.PATHOLOGY:
      return 'Other'; // Map to 'Other' as there's no direct equivalent
    case ReportTypeEnum.OTHER:
    default:
      return 'Other';
  }
}

/**
 * Calculate age from date of birth
 */
function calculateAge(dob: string): number {
  const birthDate = new Date(dob);
  const today = new Date();
  let age = today.getFullYear() - birthDate.getFullYear();
  const monthDiff = today.getMonth() - birthDate.getMonth();
  
  if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birthDate.getDate())) {
    age--;
  }
  
  return age;
}

/**
 * GET handler for /api/reports
 * Returns a list of medical reports with optional filtering and pagination
 */
export const GET = withDb(async (request: NextRequest) => {
  try {
    // Get query parameters
    const { searchParams } = new URL(request.url);
    
    // Get reports collection
    const reportsCollection = await getReportsCollection();
    
    // Build MongoDB query
    const query: any = {};
    
    // Type filter
    const typeParam = searchParams.get('type');
    if (typeParam) {
      const types = typeParam.split(',');
      query.type = { $in: types };
    }
    
    // Status filter
    const statusParam = searchParams.get('status');
    if (statusParam) {
      const statuses = statusParam.split(',');
      query.status = { $in: statuses };
    }
    
    // Date range filter
    const startDate = searchParams.get('startDate');
    const endDate = searchParams.get('endDate');
    if (startDate && endDate) {
      query.uploadDate = {
        $gte: new Date(startDate),
        $lte: new Date(endDate)
      };
    }
    
    // Search term
    const searchTerm = searchParams.get('search');
    if (searchTerm) {
      query.$or = [
        { title: { $regex: searchTerm, $options: 'i' } },
        { description: { $regex: searchTerm, $options: 'i' } },
        { provider: { $regex: searchTerm, $options: 'i' } },
        { patientName: { $regex: searchTerm, $options: 'i' } }
      ];
    }
    
    // Pagination
    const page = parseInt(searchParams.get('page') || '1', 10);
    const limit = parseInt(searchParams.get('limit') || '10', 10);
    const skip = (page - 1) * limit;
    
    // Get total count for pagination
    const total = await reportsCollection.countDocuments(query);
    
    // Get paginated reports with proper date sorting
    const reports = await reportsCollection
      .find(query)
      .sort({ uploadDate: -1 }) // Sort by upload date in descending order (newest first)
      .skip(skip)
      .limit(limit)
      .toArray();
      
    // Ensure dates are properly formatted
    const formattedReports = reports.map(report => ({
      ...report,
      uploadDate: report.uploadDate ? new Date(report.uploadDate).toISOString() : new Date().toISOString(),
      processedDate: report.processedDate ? new Date(report.processedDate).toISOString() : undefined
    }));
    
    // Prepare pagination metadata
    const pagination: PaginationParams = {
      page,
      limit,
      total,
    };
    
    // Return response with properly formatted reports
    return NextResponse.json({
      success: true,
      data: formattedReports,
      pagination,
    });
  } catch (error) {
    console.error('Error fetching reports:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to fetch reports' },
      { status: 500 }
    );
  }
})

/**
 * POST handler for /api/reports
 * Uploads a new medical report and processes it with AI analysis
 */
export const POST = withDb(async (request: NextRequest) => {
  try {
    // Parse the form data from the request
    const formData = await request.formData();
    const file = formData.get('file') as File;
    
    // Get additional metadata from the form
    const patientName = formData.get('patientName') as string || 'Unknown Patient';
    const patientDOB = formData.get('patientDob') as string || '';
    const provider = formData.get('provider') as string || 'Unknown Provider';
    const reportDate = formData.get('reportDate') as string || new Date().toISOString();
    const notes = formData.get('notes') as string || '';
    const reportTypeFromForm = formData.get('reportType') as string || '';
    
    if (!file) {
      return NextResponse.json(
        { success: false, error: 'No file provided' },
        { status: 400 }
      );
    }
    
    // Import the necessary modules for file processing and AI analysis
    // Using dynamic imports to avoid server-side issues with certain libraries
    const { processMedicalFile, createUnifiedAnalysis } = await import('../../../lib/fileProcessing');
    const { GroqAIService, ReportType } = await import('../../../lib/aiService');
    const aiService = new GroqAIService();
    
    // Process the uploaded file
    let reportTypeEnum = undefined;
    if (reportTypeFromForm) {
      // Convert string to enum
      reportTypeEnum = reportTypeFromForm as unknown as ReportTypeEnum;
    }
    
    // Process the uploaded file
    const { text, reportType, fileType, imageBuffer, standardizedData, parameters } = await processMedicalFile(file);
    
    // Use the reportType from form if provided, otherwise use the detected one
    // Ensure finalReportType is of type ReportTypeEnum to avoid type errors
    const finalReportType: ReportTypeEnum = reportTypeEnum || reportType as ReportTypeEnum;
    
    // Generate a unique ID for the report
    const reportId = 'rep_' + Math.random().toString(36).substring(2, 15);
    
    // Create initial report object
    const report: MedicalReport = {
      id: reportId,
      userId: 'user-id', // This would normally come from the authenticated user
      title: file.name.replace(/\.[^/.]+$/, ''), // Remove file extension
      type: convertReportType(finalReportType), // Convert enum value to string type from types/index.ts
      uploadDate: new Date().toISOString(),
      processedDate: new Date().toISOString(),
      status: 'processing',
      fileType: fileType,
      patientName: patientName,
      patientDOB: patientDOB,
      provider: provider,
      reportDate: reportDate,
      // Store notes in the description field
      description: notes || '',
      results: parameters && parameters.length > 0 ? parameters : 
               (standardizedData && standardizedData.parameters ? standardizedData.parameters : []),
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };
    
    // If we have extracted parameters or standardized data from the file processing, use it to populate the report
    if (parameters && parameters.length > 0) {
      // Use the extracted parameters as the primary source of results
      report.results = parameters;
    } else if (standardizedData) {
      // Fall back to standardized data if parameters aren't available
      if (standardizedData.results && Array.isArray(standardizedData.results)) {
        report.results = standardizedData.results;
      }
      
      // Extract other metadata if available
      if (standardizedData.provider) report.provider = standardizedData.provider;
      if (standardizedData.patientName) report.patientName = standardizedData.patientName;
      if (standardizedData.patientDob) report.patientDOB = standardizedData.patientDob;
      if (standardizedData.reportDate) report.reportDate = standardizedData.reportDate;
      if (standardizedData.description) report.description = standardizedData.description;
    } else {
      // If no standardized data, create sample results based on the report type
      if (finalReportType === ReportTypeEnum.CBC) { // Using enum from aiService.ts for comparison
        report.results = [
          { name: 'WBC', value: '7.5', unit: 'x10^9/L', status: 'normal', referenceRange: { min: '4.0', max: '11.0' } },
          { name: 'RBC', value: '5.0', unit: 'x10^12/L', status: 'normal', referenceRange: { min: '4.5', max: '5.5' } },
          { name: 'Hemoglobin', value: '14.2', unit: 'g/dL', status: 'normal', referenceRange: { min: '13.5', max: '17.5' } },
          { name: 'Hematocrit', value: '42', unit: '%', status: 'normal', referenceRange: { min: '41', max: '50' } },
          { name: 'Platelets', value: '250', unit: 'x10^9/L', status: 'normal', referenceRange: { min: '150', max: '400' } },
        ];
      } else if (finalReportType === ReportTypeEnum.LIPID_PANEL) { // Using enum from aiService.ts for comparison
        report.results = [
          { name: 'Total Cholesterol', value: '190', unit: 'mg/dL', status: 'normal', referenceRange: { min: '0', max: '200' } },
          { name: 'HDL Cholesterol', value: '45', unit: 'mg/dL', status: 'normal', referenceRange: { min: '40', max: '60' } },
          { name: 'LDL Cholesterol', value: '120', unit: 'mg/dL', status: 'normal', referenceRange: { min: '0', max: '130' } },
          { name: 'Triglycerides', value: '150', unit: 'mg/dL', status: 'normal', referenceRange: { min: '0', max: '150' } },
        ];
      }
    }
    
    // Process with AI service
    try {
      // Create a unified analysis that combines text and image data
      // Since we're using the ReportType from fileProcessing.ts which is now aliased to ReportTypeFromTypes,
      // we need to ensure type compatibility
      const analysis = await createUnifiedAnalysis({
        text,
        reportType: finalReportType as any, // Use type assertion to avoid type conflicts
        fileType,
        imageBuffer,
        standardizedData,
        parameters
      });
      
      // Update the report with the analysis
      report.analysis = analysis;
      report.status = 'completed';
      
      // Generate personalized health recommendations if available
      try {
        const recommendations = await aiService.generatePersonalizedRecommendations(report, {
          age: patientDOB ? calculateAge(patientDOB) : undefined,
          conditions: [], // In a real app, this would come from patient history
          medications: [] // In a real app, this would come from patient history
        });
        
        if (recommendations) {
          report.analysis = {
            ...report.analysis,
            recommendations: recommendations,
            findings: report.analysis?.findings || [] // Ensure findings is always an array
          };
        }
      } catch (recError) {
        console.error('Error generating recommendations:', recError);
        // Continue without recommendations if generation fails
      }
      
      // Save the report to MongoDB
      const reportsCollection = await getReportsCollection();
      const result = await reportsCollection.insertOne(report);
      
      // Update the report with the MongoDB _id
      report.id = result.insertedId.toString();
      
      return NextResponse.json({
        success: true,
        message: 'Report uploaded and analyzed successfully',
        data: report,
      });
    } catch (aiError) {
      console.error('Error analyzing report with AI:', aiError);
      
      // Even if AI analysis fails, we still return the report
      report.status = 'completed_with_errors';
      
      return NextResponse.json({
        success: true,
        message: 'Report uploaded but analysis encountered errors',
        data: report,
        error: 'AI analysis failed',
      });
    }
  } catch (error) {
    console.error('Error uploading report:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to upload report' },
      { status: 500 }
    );
  }
})