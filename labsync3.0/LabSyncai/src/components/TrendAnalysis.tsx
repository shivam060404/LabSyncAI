'use client';

import { useState, useEffect } from 'react';
import { Card, Button } from '@/components/ui';

interface TrendDataPoint {
  date: string;
  value: number | null;
  unit: string;
  status: string;
  reportId: string;
  reportTitle: string;
}

interface TrendStatistics {
  min: number;
  max: number;
  average: number;
  trend: string;
  direction: 'increasing' | 'decreasing' | 'stable';
}

interface TrendAnalysisProps {
  patientName: string;
  initialTestName?: string;
}

export default function TrendAnalysis({ patientName, initialTestName }: TrendAnalysisProps) {
  const [testName, setTestName] = useState(initialTestName || 'Glucose');
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [trendData, setTrendData] = useState<TrendDataPoint[]>([]);
  const [statistics, setStatistics] = useState<TrendStatistics | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  
  // Common test options
  const testOptions = [
    'Glucose',
    'Cholesterol',
    'Hemoglobin',
    'White Blood Cell Count',
    'Red Blood Cell Count',
    'Platelet Count',
    'Blood Pressure',
    'Heart Rate',
    'Triglycerides',
    'HDL Cholesterol',
    'LDL Cholesterol'
  ];
  
  // Fetch trend data
  const fetchTrendData = async () => {
    setIsLoading(true);
    setError(null);
    
    try {
      // Build query parameters
      const params = new URLSearchParams();
      params.append('patientName', patientName);
      params.append('testName', testName);
      
      if (startDate) {
        params.append('startDate', startDate);
      }
      
      if (endDate) {
        params.append('endDate', endDate);
      }
      
      // Fetch data
      const response = await fetch(`/api/trends?${params.toString()}`);
      
      if (!response.ok) {
        throw new Error('Failed to fetch trend data');
      }
      
      const result = await response.json();
      
      if (result.success && result.data) {
        setTrendData(result.data.trendData);
        setStatistics(result.data.statistics);
      } else {
        throw new Error(result.message || 'Failed to fetch trend data');
      }
    } catch (error) {
      console.error('Error fetching trend data:', error);
      setError('Failed to fetch trend data. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };
  
  // Initial fetch
  useEffect(() => {
    if (patientName && testName) {
      fetchTrendData();
    }
  }, [patientName, testName]);
  
  // Get color based on trend direction
  const getTrendColor = (direction: string) => {
    switch (direction) {
      case 'increasing':
        return 'text-danger';
      case 'decreasing':
        return 'text-success';
      default:
        return 'text-gray-400';
    }
  };
  
  // Get status color
  const getStatusColor = (status: string) => {
    switch (status.toLowerCase()) {
      case 'high':
        return 'text-danger';
      case 'low':
        return 'text-warning';
      default:
        return 'text-success';
    }
  };
  
  // Format date
  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };
  
  // Calculate chart dimensions
  const calculateChartDimensions = () => {
    if (trendData.length === 0) return { height: 200, width: 600, padding: 40 };
    
    const height = 200;
    const width = Math.max(600, trendData.length * 100);
    const padding = 40;
    
    return { height, width, padding };
  };
  
  // Render chart
  const renderChart = () => {
    if (trendData.length === 0) return null;
    
    const { height, width, padding } = calculateChartDimensions();
    
    // Find min and max values for scaling
    const values = trendData.map(d => d.value).filter(v => v !== null) as number[];
    const minValue = Math.min(...values);
    const maxValue = Math.max(...values);
    const range = maxValue - minValue;
    
    // Scale values to chart height
    const scaleY = (value: number) => {
      return height - padding - ((value - minValue) / (range || 1)) * (height - 2 * padding);
    };
    
    // Scale x positions
    const scaleX = (index: number) => {
      return padding + (index / (trendData.length - 1 || 1)) * (width - 2 * padding);
    };
    
    // Generate path for the line
    let path = '';
    trendData.forEach((point, i) => {
      if (point.value === null) return;
      
      const x = scaleX(i);
      const y = scaleY(point.value);
      
      if (i === 0) {
        path += `M ${x} ${y}`;
      } else {
        path += ` L ${x} ${y}`;
      }
    });
    
    return (
      <div className="overflow-x-auto">
        <svg width={width} height={height} className="mt-4">
          {/* Y-axis */}
          <line 
            x1={padding} 
            y1={padding} 
            x2={padding} 
            y2={height - padding} 
            stroke="#4B5563" 
            strokeWidth="1"
          />
          
          {/* X-axis */}
          <line 
            x1={padding} 
            y1={height - padding} 
            x2={width - padding} 
            y2={height - padding} 
            stroke="#4B5563" 
            strokeWidth="1"
          />
          
          {/* Line chart */}
          <path 
            d={path} 
            fill="none" 
            stroke="#3B82F6" 
            strokeWidth="2"
          />
          
          {/* Data points */}
          {trendData.map((point, i) => {
            if (point.value === null) return null;
            
            const x = scaleX(i);
            const y = scaleY(point.value);
            
            return (
              <g key={i}>
                <circle 
                  cx={x} 
                  cy={y} 
                  r="4" 
                  fill={point.status === 'normal' ? '#3B82F6' : point.status === 'high' ? '#EF4444' : '#F59E0B'}
                />
                
                {/* Value label */}
                <text 
                  x={x} 
                  y={y - 10} 
                  textAnchor="middle" 
                  fontSize="12" 
                  fill="#D1D5DB"
                >
                  {point.value}
                </text>
                
                {/* Date label */}
                <text 
                  x={x} 
                  y={height - padding + 20} 
                  textAnchor="middle" 
                  fontSize="10" 
                  fill="#9CA3AF"
                  transform={`rotate(45, ${x}, ${height - padding + 20})`}
                >
                  {formatDate(point.date)}
                </text>
              </g>
            );
          })}
          
          {/* Y-axis labels */}
          <text 
            x={padding - 10} 
            y={padding} 
            textAnchor="end" 
            fontSize="12" 
            fill="#9CA3AF"
          >
            {maxValue}
          </text>
          
          <text 
            x={padding - 10} 
            y={height - padding} 
            textAnchor="end" 
            fontSize="12" 
            fill="#9CA3AF"
          >
            {minValue}
          </text>
          
          <text 
            x={padding - 10} 
            y={(height) / 2} 
            textAnchor="end" 
            fontSize="12" 
            fill="#9CA3AF"
          >
            {((maxValue + minValue) / 2).toFixed(1)}
          </text>
          
          {/* Unit label */}
          <text 
            x={padding - 25} 
            y={height / 2} 
            textAnchor="middle" 
            fontSize="12" 
            fill="#9CA3AF"
            transform={`rotate(-90, ${padding - 25}, ${height / 2})`}
          >
            {trendData[0]?.unit || ''}
          </text>
        </svg>
      </div>
    );
  };
  
  return (
    <Card className="p-6">
      <h3 className="text-lg font-medium mb-4">Longitudinal Analysis</h3>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
        <div>
          <label className="block text-sm font-medium text-gray-400 mb-1">Test Parameter</label>
          <select
            value={testName}
            onChange={(e) => setTestName(e.target.value)}
            className="w-full bg-card-hover border border-gray-700 rounded-lg px-4 py-2 focus:outline-none focus:ring-1 focus:ring-accent"
          >
            {testOptions.map(option => (
              <option key={option} value={option}>{option}</option>
            ))}
          </select>
        </div>
        
        <div>
          <label className="block text-sm font-medium text-gray-400 mb-1">Start Date</label>
          <input
            type="date"
            value={startDate}
            onChange={(e) => setStartDate(e.target.value)}
            className="w-full bg-card-hover border border-gray-700 rounded-lg px-4 py-2 focus:outline-none focus:ring-1 focus:ring-accent"
          />
        </div>
        
        <div>
          <label className="block text-sm font-medium text-gray-400 mb-1">End Date</label>
          <input
            type="date"
            value={endDate}
            onChange={(e) => setEndDate(e.target.value)}
            className="w-full bg-card-hover border border-gray-700 rounded-lg px-4 py-2 focus:outline-none focus:ring-1 focus:ring-accent"
          />
        </div>
      </div>
      
      <div className="flex justify-end mb-6">
        <Button variant="primary" onClick={fetchTrendData} disabled={isLoading}>
          {isLoading ? 'Loading...' : 'Update Analysis'}
        </Button>
      </div>
      
      {error ? (
        <div className="p-4 bg-danger/10 text-danger rounded-lg">
          {error}
        </div>
      ) : trendData.length === 0 ? (
        <div className="text-center py-8 text-gray-400">
          No trend data available for the selected parameters.
        </div>
      ) : (
        <>
          {/* Statistics */}
          {statistics && (
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
              <div className="bg-card-hover p-4 rounded-lg">
                <div className="text-sm text-gray-400 mb-1">Average</div>
                <div className="text-xl font-medium">
                  {statistics.average.toFixed(1)} {trendData[0]?.unit}
                </div>
              </div>
              
              <div className="bg-card-hover p-4 rounded-lg">
                <div className="text-sm text-gray-400 mb-1">Range</div>
                <div className="text-xl font-medium">
                  {statistics.min.toFixed(1)} - {statistics.max.toFixed(1)} {trendData[0]?.unit}
                </div>
              </div>
              
              <div className="bg-card-hover p-4 rounded-lg">
                <div className="text-sm text-gray-400 mb-1">Trend</div>
                <div className={`text-xl font-medium ${getTrendColor(statistics.direction)}`}>
                  {statistics.trend}
                </div>
              </div>
              
              <div className="bg-card-hover p-4 rounded-lg">
                <div className="text-sm text-gray-400 mb-1">Direction</div>
                <div className={`text-xl font-medium ${getTrendColor(statistics.direction)}`}>
                  {statistics.direction.charAt(0).toUpperCase() + statistics.direction.slice(1)}
                </div>
              </div>
            </div>
          )}
          
          {/* Chart */}
          {renderChart()}
          
          {/* Data table */}
          <div className="mt-6">
            <h4 className="text-sm font-medium text-gray-400 mb-2">Historical Data</h4>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-gray-800">
                    <th className="text-left py-3 px-4">Date</th>
                    <th className="text-left py-3 px-4">Value</th>
                    <th className="text-left py-3 px-4">Status</th>
                    <th className="text-left py-3 px-4">Report</th>
                  </tr>
                </thead>
                <tbody>
                  {trendData.map((point, index) => (
                    <tr key={index} className="border-b border-gray-800 last:border-0">
                      <td className="py-3 px-4">{formatDate(point.date)}</td>
                      <td className="py-3 px-4 font-medium">
                        {point.value !== null ? `${point.value} ${point.unit}` : 'N/A'}
                      </td>
                      <td className="py-3 px-4">
                        <span className={getStatusColor(point.status)}>
                          {point.status.charAt(0).toUpperCase() + point.status.slice(1)}
                        </span>
                      </td>
                      <td className="py-3 px-4">
                        <a href={`/dashboard/reports/${point.reportId}`} className="text-accent hover:underline">
                          {point.reportTitle}
                        </a>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </>
      )}
    </Card>
  );
}