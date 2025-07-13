import { NextRequest, NextResponse } from 'next/server';
import { getReportsCollection } from '../../../../lib/db';
import { withDb } from '../../../../lib/dbConnect';
import { ObjectId } from 'mongodb';

/**
 * GET handler for /api/reports/[id]
 * Returns a single medical report by ID
 */
export const GET = withDb(async (
  request: NextRequest,
  { params }: { params: { id: string } }
) => {
  try {
    const { id } = params;
    
    // Get reports collection
    const reportsCollection = await getReportsCollection();
    
    // Find the report with the matching ID
    let objectId;
    try {
      objectId = new ObjectId(id);
    } catch (error) {
      return NextResponse.json(
        { success: false, error: 'Invalid report ID format' },
        { status: 400 }
      );
    }
    
    const report = await reportsCollection.findOne({ _id: objectId });
    
    if (!report) {
      return NextResponse.json(
        { success: false, error: 'Report not found' },
        { status: 404 }
      );
    }
    
    // Convert MongoDB _id to string id for consistency
    const reportWithStringId = {
      ...report,
      id: report._id.toString(),
    };
    
    return NextResponse.json({
      success: true,
      data: reportWithStringId,
    });
  } catch (error) {
    console.error('Error fetching report:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to fetch report' },
      { status: 500 }
    );
  }
})

/**
 * DELETE handler for /api/reports/[id]
 * Deletes a medical report by ID
 */
export const DELETE = withDb(async (
  request: NextRequest,
  { params }: { params: { id: string } }
) => {
  try {
    const { id } = params;
    
    // Get reports collection
    const reportsCollection = await getReportsCollection();
    
    // Convert string ID to ObjectId
    let objectId;
    try {
      objectId = new ObjectId(id);
    } catch (error) {
      return NextResponse.json(
        { success: false, error: 'Invalid report ID format' },
        { status: 400 }
      );
    }
    
    // Delete the report from the database
    const result = await reportsCollection.deleteOne({ _id: objectId });
    
    if (result.deletedCount === 0) {
      return NextResponse.json(
        { success: false, error: 'Report not found' },
        { status: 404 }
      );
    }
    
    return NextResponse.json({
      success: true,
      message: `Report ${id} deleted successfully`,
    });
  } catch (error) {
    console.error('Error deleting report:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to delete report' },
      { status: 500 }
    );
  }
})