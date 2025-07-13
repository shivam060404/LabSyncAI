import { NextRequest, NextResponse } from 'next/server';
import aiService from '../../../lib/aiService';
import { getReportsCollection, getCollection, toObjectId } from '../../../lib/db';
import { withDb } from '../../../lib/dbConnect';
import { ObjectId } from 'mongodb';
import { MedicalReport, ReportStatus } from '../../../types';

/**
 * Calculate age from date of birth
 * @param dob Date of birth string
 * @returns Age in years
 */
function calculateAge(dob: string): number {
  const birthDate = new Date(dob);
  const today = new Date();
  let age = today.getFullYear() - birthDate.getFullYear();
  const monthDiff = today.getMonth() - birthDate.getMonth();
  
  // Adjust age if birthday hasn't occurred yet this year
  if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birthDate.getDate())) {
    age--;
  }
  
  return age;
}

// Using the imported AI service instance

/**
 * POST handler for /api/recommendations
 * Generates personalized health recommendations based on report results and patient context
 */
export const POST = withDb(async (request: NextRequest) => {
  try {
    // Parse the request body
    const body = await request.json();
    const { 
      reportId, 
      reportType, 
      results, 
      patientName, 
      patientDOB, 
      previousConditions = [], 
      medications = [],
      lifestyle = {}
    } = body;
    
    // Validate the request
    if (!reportType || !results || !Array.isArray(results)) {
      return NextResponse.json(
        { success: false, message: 'Report type and results array are required' },
        { status: 400 }
      );
    }
    
    // Generate personalized recommendations
    const report: MedicalReport = {
      id: reportId || 'temp-id',
      userId: 'user-id',
      type: reportType as any,
      title: `${reportType} Report`,
      status: 'completed' as ReportStatus,
      results,
      patientName,
      uploadDate: new Date(),
      createdAt: new Date(),
      updatedAt: new Date()
    };
    
    const patientHistory = {
      age: patientDOB ? calculateAge(patientDOB) : undefined,
      conditions: previousConditions,
      medications,
      lifestyle
    };
    
    const recommendations = await aiService.generatePersonalizedRecommendations(report, patientHistory);
    
    // Save recommendations to database
    const recommendationsCollection = await getCollection('recommendations');
    
    const recommendationDoc = {
      recommendations,
      reportId,
      generatedAt: new Date(),
      patientName,
      patientDOB,
      reportType
    };
    
    const result = await recommendationsCollection.insertOne(recommendationDoc);
    
    // Return the recommendations
    return NextResponse.json({
      success: true,
      data: {
        recommendations,
        reportId,
        generatedAt: new Date().toISOString(),
        id: result.insertedId.toString()
      }
    });
  } catch (error) {
    console.error('Error generating recommendations:', error);
    return NextResponse.json(
      { success: false, message: 'Failed to generate recommendations' },
      { status: 500 }
    );
  }
})

/**
 * GET handler for /api/recommendations
 * Retrieves previously generated recommendations for a specific report
 */
export const GET = withDb(async (request: NextRequest) => {
  try {
    // Get query parameters
    const { searchParams } = new URL(request.url);
    const reportId = searchParams.get('reportId');
    
    // Validate the request
    if (!reportId) {
      return NextResponse.json(
        { success: false, message: 'Report ID is required' },
        { status: 400 }
      );
    }
    
    // Get the recommendations collection
    const recommendationsCollection = await getCollection('recommendations');
    
    // Try to find existing recommendations for this report
    let recommendations;
    
    // Try to find by reportId
    const storedRecommendations = await recommendationsCollection.findOne({ reportId }) as { recommendations: any[] } | null;
    
    if (storedRecommendations) {
      // We found stored recommendations
      recommendations = storedRecommendations.recommendations;
    } else {
      // No stored recommendations, try to get the report and generate new ones
      const reportsCollection = await getReportsCollection();
      
      // Try to convert to ObjectId if it's in that format
      let reportQuery;
      try {
        reportQuery = { _id: new ObjectId(reportId) };
      } catch (e) {
        // If not a valid ObjectId, try using it as a string id
        reportQuery = { id: reportId };
      }
      
      const report = await reportsCollection.findOne(reportQuery);
      
      if (!report) {
        return NextResponse.json(
          { success: false, message: 'Report not found' },
          { status: 404 }
        );
      }
      
      // Generate recommendations based on the report
      const reportData: MedicalReport = {
        id: report._id.toString(),
        userId: report.userId || 'user-id',
        type: report.type as any,
        title: report.title || `${report.type} Report`,
        status: (report.status || 'completed') as ReportStatus,
        results: report.results,
        patientName: report.patientName,
        uploadDate: report.uploadDate || new Date(),
        createdAt: report.createdAt || new Date(),
        updatedAt: report.updatedAt || new Date()
      };
      
      const patientHistory = {
        age: report.patientDOB ? calculateAge(report.patientDOB as string) : undefined,
        conditions: [],
        medications: [],
        lifestyle: {}
      };
      
      recommendations = await aiService.generatePersonalizedRecommendations(reportData, patientHistory);
      
      // Save the generated recommendations
      const recommendationDoc = {
        recommendations,
        reportId: report._id.toString(),
        generatedAt: new Date(),
        patientName: report.patientName,
        patientDOB: report.patientDOB,
        reportType: report.type
      };
      
      await recommendationsCollection.insertOne(recommendationDoc);
    }
    
    // Return the recommendations
    return NextResponse.json({
      success: true,
      data: {
        recommendations,
        reportId,
        generatedAt: new Date().toISOString()
      }
    });
  } catch (error) {
    console.error('Error retrieving recommendations:', error);
    return NextResponse.json(
      { success: false, message: 'Failed to retrieve recommendations' },
      { status: 500 }
    );
  }
})