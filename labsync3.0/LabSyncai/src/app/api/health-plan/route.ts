import { NextRequest, NextResponse } from 'next/server';
import aiService from '../../../lib/aiService';
import { MedicalReport, HealthPlan } from '../../../types';
import { getReportsCollection, getCollection, toObjectId } from '../../../lib/db';
import { withDb } from '../../../lib/dbConnect';
import { ObjectId } from 'mongodb';

// Using the imported AI service instance

/**
 * POST handler for /api/health-plan
 * Generates a comprehensive personalized health plan based on report results and patient data
 */
export const POST = withDb(async (request: NextRequest) => {
  try {
    // Parse the request body
    const body = await request.json();
    const { 
      reportId, 
      report, 
      patientData = {}
    } = body;
    
    // Validate the request
    if (!report) {
      return NextResponse.json(
        { success: false, message: 'Report data is required' },
        { status: 400 }
      );
    }
    
    // Generate personalized health plan
    const healthPlan = await aiService.generateHealthPlan(report, patientData);
    
    // Save the health plan to the database
    const healthPlansCollection = await getCollection<HealthPlan & { reportId: string, userId: string }>('health_plans');
    
    // Create the health plan document
    const healthPlanDoc = {
      ...healthPlan,
      reportId,
      userId: report.userId || 'unknown',
      generatedAt: new Date()
    };
    
    // Insert the health plan
    const result = await healthPlansCollection.insertOne(healthPlanDoc);
    
    // Return the health plan
    return NextResponse.json({
      success: true,
      data: {
        healthPlan,
        reportId,
        generatedAt: new Date().toISOString(),
        id: result.insertedId.toString()
      }
    });
  } catch (error) {
    console.error('Error generating health plan:', error);
    return NextResponse.json(
      { success: false, message: 'Failed to generate health plan' },
      { status: 500 }
    );
  }
})

/**
 * GET handler for /api/health-plan
 * Retrieves a previously generated health plan for a specific report
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
    
    // Get the health plans collection
    const healthPlansCollection = await getCollection<HealthPlan & { reportId: string }>('health_plans');
    
    // Try to find an existing health plan for this report
    let healthPlan;
    let report;
    
    // First check if we have a stored health plan
    const storedHealthPlan = await healthPlansCollection.findOne({ 
      reportId: reportId 
    });
    
    if (storedHealthPlan) {
      // We found a stored health plan
      healthPlan = storedHealthPlan;
    } else {
      // No stored health plan, get the report and generate one
      const reportsCollection = await getReportsCollection();
      
      // Try to convert to ObjectId if it's in that format
      let reportQuery;
      try {
        reportQuery = { _id: new ObjectId(reportId) };
      } catch (e) {
        // If not a valid ObjectId, try using it as a string id
        reportQuery = { id: reportId };
      }
      
      report = await reportsCollection.findOne(reportQuery);
      
      if (!report) {
        return NextResponse.json(
          { success: false, message: 'Report not found' },
          { status: 404 }
        );
      }
      
      // Get user data (in a real app, this would come from a user profile)
      const mockPatientData = {
        age: 45,
        gender: 'male',
        height: 175,
        weight: 80,
        conditions: ['Hypertension'],
        medications: ['Lisinopril 10mg'],
        lifestyle: {
          diet: 'Mixed, high in processed foods',
          exercise: 'Sedentary, occasional walking',
          smoking: 'Non-smoker',
          alcohol: 'Moderate (2-3 drinks per week)'
        }
      };
      
      // Generate a health plan
      const generatedHealthPlan = await aiService.generateHealthPlan(report, mockPatientData);
      
      // Save the generated health plan
      const healthPlanDoc = {
        ...generatedHealthPlan,
        reportId: report._id.toString(),
        userId: report.userId || 'unknown',
        generatedAt: new Date()
      };
      
      const result = await healthPlansCollection.insertOne(healthPlanDoc);
      healthPlan = healthPlanDoc;
    }
  
    // Return the health plan
    return NextResponse.json({
      success: true,
      data: {
        healthPlan,
        reportId,
        generatedAt: new Date().toISOString()
      }
    });
  } catch (error) {
    console.error('Error retrieving health plan:', error);
    return NextResponse.json(
      { success: false, message: 'Failed to retrieve health plan' },
      { status: 500 }
    );
  }
})