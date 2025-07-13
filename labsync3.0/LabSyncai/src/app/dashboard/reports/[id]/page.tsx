'use client';

import { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import DashboardLayout from '@/components/layout/DashboardLayout';
import { Card, Button } from '@/components/ui';

type Report = {
  id: string;
  name: string;
  type: string;
  date: string;
  status: 'normal' | 'abnormal' | 'critical';
  highlights: string[];
  details: {
    patient: string;
    doctor: string;
    lab: string;
    results: Array<{
      name: string;
      value: string;
      unit: string;
      range: string;
      status: string;
    }>;
    summary: string;
    recommendations: string[];
  };
  healthPlan?: {
    summary: string;
    dietaryRecommendations: string[];
    exerciseRecommendations: string[];
    lifestyleChanges: string[];
    medicationNotes?: string[];
    followUpSchedule?: string;
    goals: Array<{description: string, timeframe: string}>;
  };
};

export default function ReportDetail() {
  const params = useParams();
  const router = useRouter();
  const [report, setReport] = useState<Report | null>(null);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('overview');
  const [loadingHealthPlan, setLoadingHealthPlan] = useState(false);
  const [healthPlanError, setHealthPlanError] = useState<string | null>(null);
  
  useEffect(() => {
    // Simulate API fetch
    setTimeout(() => {
      // Mock data for the specific report
      const mockReport: Report = {
        id: params.id as string,
        name: 'Complete Blood Count',
        type: 'blood',
        date: '2023-12-15',
        status: 'abnormal',
        highlights: [
          'Elevated white blood cell count (12.5 x10^9/L)',
          'Slightly decreased red blood cell count (4.2 x10^12/L)',
          'Normal hemoglobin levels (14.2 g/dL)',
          'Normal platelet count (250 x10^9/L)'
        ],
        details: {
          patient: 'John Smith',
          doctor: 'Dr. Sarah Johnson',
          lab: 'LabCorp Medical',
          results: [
            { name: 'White Blood Cell Count', value: '12.5', unit: 'x10^9/L', range: '4.0-11.0', status: 'high' },
            { name: 'Red Blood Cell Count', value: '4.2', unit: 'x10^12/L', range: '4.5-5.9', status: 'low' },
            { name: 'Hemoglobin', value: '14.2', unit: 'g/dL', range: '13.5-17.5', status: 'normal' },
            { name: 'Hematocrit', value: '42', unit: '%', range: '41-50', status: 'normal' },
            { name: 'Platelet Count', value: '250', unit: 'x10^9/L', range: '150-450', status: 'normal' },
            { name: 'Mean Corpuscular Volume', value: '88', unit: 'fL', range: '80-96', status: 'normal' },
            { name: 'Mean Corpuscular Hemoglobin', value: '29', unit: 'pg', range: '27-33', status: 'normal' },
            { name: 'Neutrophils', value: '70', unit: '%', range: '40-60', status: 'high' },
            { name: 'Lymphocytes', value: '20', unit: '%', range: '20-40', status: 'normal' },
            { name: 'Monocytes', value: '7', unit: '%', range: '2-8', status: 'normal' },
            { name: 'Eosinophils', value: '2', unit: '%', range: '1-4', status: 'normal' },
            { name: 'Basophils', value: '1', unit: '%', range: '0-1', status: 'normal' },
          ],
          summary: 'This Complete Blood Count (CBC) shows an elevated white blood cell count, particularly neutrophils, which may indicate an ongoing bacterial infection or inflammation. The red blood cell count is slightly below the normal range, which could suggest mild anemia. All other parameters are within normal ranges.',
          recommendations: [
            'Follow up with your primary care physician to discuss the elevated white blood cell count',
            'Consider additional testing to identify the source of potential infection or inflammation',
            'Monitor red blood cell count with a follow-up CBC in 4-6 weeks',
            'Maintain adequate hydration and a balanced diet rich in iron'
          ]
        },
        healthPlan: {
          summary: 'Based on your CBC results showing elevated white blood cell count and slightly decreased red blood cell count, this personalized health plan focuses on supporting your immune system, addressing potential inflammation, and improving your red blood cell health.',
          dietaryRecommendations: [
            'Increase iron-rich foods like lean red meat, spinach, and legumes to support red blood cell production',
            'Add anti-inflammatory foods such as fatty fish, olive oil, and colorful fruits and vegetables',
            'Ensure adequate protein intake (0.8g per kg of body weight) to support immune function',
            'Include vitamin C rich foods to enhance iron absorption',
            'Stay well hydrated with 2-3 liters of water daily'
          ],
          exerciseRecommendations: [
            'Engage in moderate aerobic exercise 3-5 times weekly for 30 minutes',
            'Include light strength training 2-3 times per week',
            'Consider gentle activities like walking, swimming, or cycling',
            'Avoid high-intensity exercise until infection/inflammation is resolved',
            'Include stress-reducing activities like yoga or tai chi'
          ],
          lifestyleChanges: [
            'Prioritize 7-8 hours of quality sleep nightly',
            'Practice stress management techniques like deep breathing or meditation',
            'Avoid alcohol and tobacco products which can affect blood cell production',
            'Wash hands frequently to prevent additional infections',
            'Monitor for fever, fatigue, or other symptoms of infection'
          ],
          medicationNotes: [
            'Take any prescribed antibiotics exactly as directed if bacterial infection is confirmed',
            'Avoid unnecessary over-the-counter anti-inflammatory medications unless directed by your physician',
            'Consider discussing iron supplementation with your doctor if anemia persists'
          ],
          followUpSchedule: 'Schedule a follow-up CBC test in 4-6 weeks to monitor white and red blood cell counts',
          goals: [
            {description: 'Resolve elevated white blood cell count', timeframe: '4-6 weeks'},
            {description: 'Normalize red blood cell count', timeframe: '2-3 months'},
            {description: 'Establish consistent exercise routine', timeframe: '2 weeks'},
            {description: 'Implement dietary changes', timeframe: '1 week'}
          ]
        }
      };
      
      setReport(mockReport);
      setLoading(false);
    }, 1000);
  }, [params.id]);
  
  // Function to fetch a personalized health plan
  const fetchHealthPlan = async () => {
    if (!report) return;
    
    setLoadingHealthPlan(true);
    setHealthPlanError(null);
    
    try {
      // Prepare patient data from the report
      const patientData = {
        name: report.details.patient,
        age: 45, // Mock data, would come from patient profile
        gender: 'male', // Mock data, would come from patient profile
        conditions: ['Hypertension'], // Mock data, would come from patient profile
        medications: ['Lisinopril 10mg'], // Mock data, would come from patient profile
        lifestyle: {
          diet: 'Mixed, high in processed foods',
          exercise: 'Sedentary, occasional walking',
          smoking: 'Non-smoker',
          alcohol: 'Moderate (2-3 drinks per week)'
        }
      };
      
      // Call the health plan API
      const response = await fetch(`/api/health-plan?reportId=${report.id}`);
      
      if (!response.ok) {
        throw new Error('Failed to fetch health plan');
      }
      
      const data = await response.json();
      
      if (data.success && data.data && data.data.healthPlan) {
        // Update the report with the health plan
        setReport(prev => prev ? {
          ...prev,
          healthPlan: data.data.healthPlan
        } : null);
      } else {
        throw new Error(data.message || 'Failed to get health plan');
      }
    } catch (error) {
      console.error('Error fetching health plan:', error);
      setHealthPlanError('Failed to generate health plan. Please try again.');
    } finally {
      setLoadingHealthPlan(false);
    }
  };
  
  const getStatusColor = (status: string) => {
    switch (status.toLowerCase()) {
      case 'high':
      case 'critical':
        return 'text-danger';
      case 'low':
        return 'text-warning';
      case 'normal':
        return 'text-success';
      default:
        return 'text-gray-400';
    }
  };
  
  const getStatusBg = (status: string) => {
    switch (status.toLowerCase()) {
      case 'high':
      case 'critical':
        return 'bg-danger/10';
      case 'low':
        return 'bg-warning/10';
      case 'normal':
        return 'bg-success/10';
      default:
        return 'bg-gray-700';
    }
  };

  if (loading) {
    return (
      <DashboardLayout activePage="reports">
        <div className="flex items-center justify-center h-[calc(100vh-150px)]">
          <div className="animate-pulse-slow text-accent text-2xl">Loading report...</div>
        </div>
      </DashboardLayout>
    );
  }

  if (!report) {
    return (
      <DashboardLayout activePage="reports">
        <div className="flex flex-col items-center justify-center h-[calc(100vh-150px)]">
          <div className="text-danger text-2xl mb-4">Report not found</div>
          <Button variant="primary" onClick={() => router.push('/dashboard/reports')}>
            Back to Reports
          </Button>
        </div>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout activePage="reports">
      <div className="mb-6 flex items-center">
        <Link href="/dashboard/reports" className="text-accent hover:underline mr-4">
          ← Back to Reports
        </Link>
        <h1 className="text-2xl font-bold">{report.name}</h1>
      </div>

      {/* Report Header */}
      <Card className="mb-6">
        <div className="flex flex-col md:flex-row md:items-center justify-between">
          <div>
            <div className="text-sm text-gray-400 mb-1">Report Type: {report.type.charAt(0).toUpperCase() + report.type.slice(1)}</div>
            <h2 className="text-xl font-medium">{report.name}</h2>
            <div className="mt-2 text-sm text-gray-400">
              Date: {new Date(report.date).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}
            </div>
          </div>
          
          <div className="mt-4 md:mt-0 flex items-center">
            <div className={`px-3 py-1 rounded-full text-sm ${getStatusBg(report.status)} ${getStatusColor(report.status)}`}>
              {report.status.charAt(0).toUpperCase() + report.status.slice(1)}
            </div>
          </div>
        </div>
        
        <div className="mt-6 pt-6 border-t border-gray-800">
          <div className="flex flex-col md:flex-row md:items-center text-sm">
            <div className="md:mr-6">Patient: <span className="text-gray-300">{report.details.patient}</span></div>
            <div className="md:mr-6">Doctor: <span className="text-gray-300">{report.details.doctor}</span></div>
            <div>Lab: <span className="text-gray-300">{report.details.lab}</span></div>
          </div>
        </div>
      </Card>
          
      {/* Tabs */}
      <div className="border-b border-gray-800 mb-6">
        <div className="flex space-x-6">
          <button 
            onClick={() => setActiveTab('overview')}
            className={`pb-3 px-1 ${activeTab === 'overview' ? 'text-accent border-b-2 border-accent' : 'text-gray-400 hover:text-gray-300'}`}
          >
            Overview
          </button>
          <button 
            onClick={() => setActiveTab('results')}
            className={`pb-3 px-1 ${activeTab === 'results' ? 'text-accent border-b-2 border-accent' : 'text-gray-400 hover:text-gray-300'}`}
          >
            Test Results
          </button>
          <button 
            onClick={() => setActiveTab('analysis')}
            className={`pb-3 px-1 ${activeTab === 'analysis' ? 'text-accent border-b-2 border-accent' : 'text-gray-400 hover:text-gray-300'}`}
          >
            AI Analysis
          </button>
          <button 
            onClick={() => {
              setActiveTab('healthPlan');
              if (report && !report.healthPlan && !loadingHealthPlan) {
                fetchHealthPlan();
              }
            }}
            className={`pb-3 px-1 ${activeTab === 'healthPlan' ? 'text-accent border-b-2 border-accent' : 'text-gray-400 hover:text-gray-300'}`}
          >
            Health Plan
          </button>
        </div>
      </div>
          
      {/* Tab Content */}
      <div>
        {/* Overview Tab */}
        {activeTab === 'overview' && (
          <div>
            <Card className="mb-6">
              <h3 className="text-lg font-medium mb-4">Key Findings</h3>
              <ul className="space-y-2">
                {report.highlights.map((highlight, index) => (
                  <li key={index} className="flex items-start">
                    <span className="text-accent mr-2">•</span>
                    <span>{highlight}</span>
                  </li>
                ))}
              </ul>
            </Card>
            
            <Card className="mb-6">
              <h3 className="text-lg font-medium mb-4">Summary</h3>
              <p>{report.details.summary}</p>
            </Card>
            
            <Card>
              <h3 className="text-lg font-medium mb-4">Recommendations</h3>
              <ul className="space-y-2">
                {report.details.recommendations.map((recommendation, index) => (
                  <li key={index} className="flex items-start">
                    <span className="text-accent mr-2">•</span>
                    <span>{recommendation}</span>
                  </li>
                ))}
              </ul>
            </Card>
          </div>
        )}
            
        {/* Results Tab */}
        {activeTab === 'results' && (
          <Card>
            <h3 className="text-lg font-medium mb-4">Test Results</h3>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-gray-800">
                    <th className="text-left py-3 px-4">Parameter</th>
                    <th className="text-left py-3 px-4">Result</th>
                    <th className="text-left py-3 px-4">Unit</th>
                    <th className="text-left py-3 px-4">Reference Range</th>
                    <th className="text-left py-3 px-4">Status</th>
                  </tr>
                </thead>
                <tbody>
                  {report.details.results.map((result, index) => (
                    <tr key={index} className="border-b border-gray-800 last:border-0">
                      <td className="py-3 px-4">{result.name}</td>
                      <td className="py-3 px-4 font-medium">{result.value}</td>
                      <td className="py-3 px-4 text-gray-400">{result.unit}</td>
                      <td className="py-3 px-4 text-gray-400">{result.range}</td>
                      <td className="py-3 px-4">
                        <span className={`px-2 py-1 rounded-full text-xs ${getStatusBg(result.status)} ${getStatusColor(result.status)}`}>
                          {result.status.charAt(0).toUpperCase() + result.status.slice(1)}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </Card>
        )}
            
        {/* Analysis Tab */}
        {activeTab === 'analysis' && (
          <div>
            <Card className="mb-6">
              <div className="flex items-center mb-4">
                <div className="h-8 w-8 rounded-full bg-accent/20 flex items-center justify-center text-accent mr-3">
                  AI
                </div>
                <h3 className="text-lg font-medium">AI Analysis</h3>
              </div>
              
              <div className="mb-6">
                <h4 className="text-sm font-medium text-gray-400 mb-2">Summary</h4>
                <p>{report.details.summary}</p>
              </div>
              
              <div className="mb-6">
                <h4 className="text-sm font-medium text-gray-400 mb-2">Possible Conditions</h4>
                <div className="space-y-3">
                  <div className="bg-card-hover p-3 rounded-lg">
                    <div className="flex justify-between items-center mb-1">
                      <div className="font-medium">Bacterial Infection</div>
                      <div className="text-sm text-gray-400">Probability: Moderate</div>
                    </div>
                    <p className="text-sm text-gray-300">The elevated white blood cell count, particularly neutrophils, suggests a possible bacterial infection.</p>
                  </div>
                  
                  <div className="bg-card-hover p-3 rounded-lg">
                    <div className="flex justify-between items-center mb-1">
                      <div className="font-medium">Mild Anemia</div>
                      <div className="text-sm text-gray-400">Probability: Low</div>
                    </div>
                    <p className="text-sm text-gray-300">The slightly low red blood cell count may indicate mild anemia, though hemoglobin levels are normal.</p>
                  </div>
                </div>
              </div>
              
              <div>
                <h4 className="text-sm font-medium text-gray-400 mb-2">Recommendations</h4>
                <ul className="space-y-2">
                  {report.details.recommendations.map((recommendation, index) => (
                    <li key={index} className="flex items-start">
                      <span className="text-accent mr-2">•</span>
                      <span>{recommendation}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </Card>
            
            <Card>
              <h3 className="text-lg font-medium mb-4">Ask AI Assistant</h3>
              <div className="mb-4">
                <textarea 
                  className="input w-full h-24" 
                  placeholder="Ask a question about this report..."
                ></textarea>
              </div>
              <Button variant="primary">
                <span className="mr-2">💬</span>
                Ask Question
              </Button>
            </Card>
          </div>
        )}
          </div>
        
        {/* Health Plan Tab */}
        {activeTab === 'healthPlan' && (
          <div>
            {loadingHealthPlan ? (
              <Card className="text-center py-12">
                <div className="flex flex-col items-center">
                  <div className="h-12 w-12 rounded-full border-4 border-accent border-t-transparent animate-spin mb-6"></div>
                  <h2 className="text-xl font-medium mb-2">Generating Your Health Plan</h2>
                  <p className="text-gray-400 max-w-md">
                    Our AI is creating a personalized health plan based on your report results and medical history.
                  </p>
                </div>
              </Card>
            ) : healthPlanError ? (
              <Card className="text-center py-12">
                <div className="flex flex-col items-center">
                  <div className="h-16 w-16 rounded-full bg-danger/20 flex items-center justify-center text-danger text-2xl mb-6">
                    !
                  </div>
                  <h2 className="text-xl font-medium mb-2">Error</h2>
                  <p className="text-gray-400 max-w-md mb-6">{healthPlanError}</p>
                  <Button variant="primary" onClick={fetchHealthPlan}>
                    Try Again
                  </Button>
                </div>
              </Card>
            ) : report?.healthPlan ? (
              <div className="space-y-6">
                <Card>
                  <div className="flex items-center mb-4">
                    <div className="h-8 w-8 rounded-full bg-accent/20 flex items-center justify-center text-accent mr-3">
                      🌱
                    </div>
                    <h3 className="text-lg font-medium">Personalized Health Plan</h3>
                  </div>
                  
                  <div className="mb-6">
                    <h4 className="text-sm font-medium text-gray-400 mb-2">Summary</h4>
                    <p>{report.healthPlan.summary}</p>
                  </div>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <h4 className="text-sm font-medium text-gray-400 mb-3">Dietary Recommendations</h4>
                      <ul className="space-y-2">
                        {report.healthPlan.dietaryRecommendations.map((item, index) => (
                          <li key={index} className="flex items-start">
                            <span className="text-accent mr-2">•</span>
                            <span>{item}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                    
                    <div>
                      <h4 className="text-sm font-medium text-gray-400 mb-3">Exercise Recommendations</h4>
                      <ul className="space-y-2">
                        {report.healthPlan.exerciseRecommendations.map((item, index) => (
                          <li key={index} className="flex items-start">
                            <span className="text-accent mr-2">•</span>
                            <span>{item}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  </div>
                </Card>
                
                <Card>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <h4 className="text-sm font-medium text-gray-400 mb-3">Lifestyle Changes</h4>
                      <ul className="space-y-2">
                        {report.healthPlan.lifestyleChanges.map((item, index) => (
                          <li key={index} className="flex items-start">
                            <span className="text-accent mr-2">•</span>
                            <span>{item}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                    
                    {report.healthPlan.medicationNotes && report.healthPlan.medicationNotes.length > 0 && (
                      <div>
                        <h4 className="text-sm font-medium text-gray-400 mb-3">Medication Notes</h4>
                        <ul className="space-y-2">
                          {report.healthPlan.medicationNotes.map((item, index) => (
                            <li key={index} className="flex items-start">
                              <span className="text-accent mr-2">•</span>
                              <span>{item}</span>
                            </li>
                          ))}
                        </ul>
                      </div>
                    )}
                  </div>
                  
                  {report.healthPlan.followUpSchedule && (
                    <div className="mt-6 p-3 bg-accent/10 rounded-lg">
                      <div className="flex items-center">
                        <div className="h-6 w-6 rounded-full bg-accent/20 flex items-center justify-center text-accent mr-2">
                          📅
                        </div>
                        <div>
                          <span className="font-medium text-accent">Follow-up Schedule</span>
                          <span className="ml-2 text-gray-300">{report.healthPlan.followUpSchedule}</span>
                        </div>
                      </div>
                    </div>
                  )}
                </Card>
                
                <Card>
                  <h4 className="text-sm font-medium text-gray-400 mb-3">Health Goals</h4>
                  <div className="space-y-4">
                    {report.healthPlan.goals.map((goal, index) => (
                      <div key={index} className="bg-card-hover p-3 rounded-lg">
                        <div className="flex justify-between items-center">
                          <div className="font-medium">{goal.description}</div>
                          <div className="text-sm bg-accent/10 text-accent px-2 py-1 rounded">
                            {goal.timeframe}
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </Card>
                
                <div className="flex justify-end">
                  <Button variant="primary" onClick={() => window.print()}>
                    <span className="mr-2">📥</span>
                    Download Health Plan
                  </Button>
                </div>
              </div>
            ) : (
              <Card className="text-center py-12">
                <div className="flex flex-col items-center">
                  <div className="h-16 w-16 rounded-full bg-accent/20 flex items-center justify-center text-accent text-2xl mb-6">
                    🌱
                  </div>
                  <h2 className="text-xl font-medium mb-2">No Health Plan Available</h2>
                  <p className="text-gray-400 max-w-md mb-6">
                    Generate a personalized health plan based on your report results and medical history.
                  </p>
                  <Button variant="primary" onClick={fetchHealthPlan}>
                    Generate Health Plan
                  </Button>
                </div>
              </Card>
            )}
          </div>
        )}
          
      {/* Actions */}
      <div className="flex flex-col sm:flex-row gap-4 mt-6">
        <Button variant="secondary" className="flex-1">
          <span className="mr-2">📥</span>
          Download PDF Report
        </Button>
        <Button variant="secondary" className="flex-1">
          <span className="mr-2">📊</span>
          View Historical Trends
        </Button>
        <Button variant="secondary" className="flex-1">
          <span className="mr-2">📱</span>
          Share Report
        </Button>
      </div>
    </DashboardLayout>
  );
}