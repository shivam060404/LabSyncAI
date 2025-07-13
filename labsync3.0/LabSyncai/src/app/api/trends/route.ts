import { NextRequest, NextResponse } from 'next/server';
import { MOCK_REPORTS } from '../../../utils/mockReports';
import aiService from '../../../lib/aiService';

// Using the imported AI service instance

export async function GET(request: NextRequest) {
  try {
    // Get query parameters
    const searchParams = request.nextUrl.searchParams;
    const patientName = searchParams.get('patientName');
    const testName = searchParams.get('testName');
    const startDate = searchParams.get('startDate');
    const endDate = searchParams.get('endDate');
    
    // Validate required parameters
    if (!patientName || !testName) {
      return NextResponse.json(
        { success: false, message: 'Patient name and test name are required' },
        { status: 400 }
      );
    }
    
    // Filter reports by patient name
    let filteredReports = MOCK_REPORTS.filter(report => 
      report.patientName?.toLowerCase() === patientName.toLowerCase()
    );
    
    // Apply date filters if provided
    if (startDate) {
      const startTimestamp = new Date(startDate).getTime();
      filteredReports = filteredReports.filter(report => 
        new Date(report.uploadDate).getTime() >= startTimestamp
      );
    }
    
    if (endDate) {
      const endTimestamp = new Date(endDate).getTime();
      filteredReports = filteredReports.filter(report => 
        new Date(report.uploadDate).getTime() <= endTimestamp
      );
    }
    
    // Sort reports by date
    filteredReports.sort((a, b) => 
      new Date(a.uploadDate).getTime() - new Date(b.uploadDate).getTime()
    );
    
    // Extract the specific test results from each report
    const trendData = filteredReports.map(report => {
      // Find the specific test result
      const testResult = report.results?.find(result => 
        result.name.toLowerCase().includes(testName.toLowerCase())
      );
      
      return {
        date: report.uploadDate,
        value: testResult ? parseFloat(testResult.value.toString()) : null,
        unit: testResult?.unit || '',
        status: testResult?.status || 'normal',
        reportId: report.id,
        reportTitle: report.title
      };
    }).filter(item => item.value !== null);
    
    // Calculate basic statistics
    let min = Number.MAX_VALUE;
    let max = Number.MIN_VALUE;
    let sum = 0;
    let count = 0;
    
    trendData.forEach(item => {
      if (item.value !== null) {
        min = Math.min(min, item.value);
        max = Math.max(max, item.value);
        sum += item.value;
        count++;
      }
    });
    
    const average = count > 0 ? sum / count : 0;
    const trend = count > 1 ? 
      (trendData[trendData.length - 1].value! - trendData[0].value!) / trendData[0].value! * 100 : 
      0;
    
    // Basic statistics object
    const basicStats = {
      min,
      max,
      average,
      trend: trend.toFixed(2) + '%',
      direction: trend > 0 ? 'increasing' : trend < 0 ? 'decreasing' : 'stable'
    };
    
    // Use AI to analyze the trend data if there are enough data points
    let aiAnalysis = null;
    if (trendData.length >= 3) {
      try {
        // Get enhanced trend analysis from AI service
        aiAnalysis = await aiService.analyzeTrends([
          ...trendData.map(item => ({
            value: item.value,
            date: item.date
          }))
        ], testName);
      } catch (aiError) {
        console.error('Error getting AI trend analysis:', aiError);
        // Continue without AI analysis if it fails
      }
    }
    
    // Return the trend data, statistics, and AI analysis
    return NextResponse.json({
      success: true,
      data: {
        patientName,
        testName,
        trendData,
        statistics: basicStats,
        aiAnalysis: aiAnalysis || {
          interpretation: `${testName} values have ${basicStats.direction} by ${basicStats.trend} over the observed period.`,
          significance: 'No AI significance analysis available',
          recommendations: []
        }
      }
    });
  } catch (error) {
    console.error('Error in trends analysis:', error);
    return NextResponse.json(
      { success: false, message: 'Failed to analyze trends' },
      { status: 500 }
    );
  }
}