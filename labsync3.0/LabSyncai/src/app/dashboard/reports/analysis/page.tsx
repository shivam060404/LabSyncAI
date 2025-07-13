'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import DashboardLayout from '../../../../components/layout/DashboardLayout';
import { Card, Button } from '../../../../components/ui';
import { MedicalReport } from '../../../../types';
import VoiceInterface from '../../../../components/VoiceInterface';

// Add type declaration for the global window object
declare global {
  interface Window {
    playAudioResponseFn?: (text: string) => Promise<void>;
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

export default function ReportAnalysis() {
  const router = useRouter();
  const [isAnalyzing, setIsAnalyzing] = useState(true);
  const [progress, setProgress] = useState(0);
  const [analysisComplete, setAnalysisComplete] = useState(false);
  const [report, setReport] = useState<MedicalReport | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [aiQuestion, setAiQuestion] = useState('');
  const [aiAnswer, setAiAnswer] = useState<string | null>(null);
  const [isAskingAi, setIsAskingAi] = useState(false);
  const [aiResponse, setAiResponse] = useState<any>(null);
  const [conversationHistory, setConversationHistory] = useState<Array<{question: string, answer: string}>>([]);
  
  // Fetch the latest report
  useEffect(() => {
    const fetchLatestReport = async () => {
      try {
        // Simulate analysis progress while fetching
        const progressInterval = setInterval(() => {
          setProgress(prev => {
            const newProgress = prev + Math.random() * 5;
            if (newProgress >= 95) {
              return 95; // Cap at 95% until we get the data
            }
            return newProgress;
          });
        }, 200);
        
        // Fetch the latest report
        const response = await fetch('/api/reports?limit=1');
        if (!response.ok) {
          throw new Error('Failed to fetch report');
        }
        
        const data = await response.json();
        
        // Check if we have any reports
        if (data.success && data.data && data.data.length > 0) {
          setReport(data.data[0]);
          
          // Complete the progress
          clearInterval(progressInterval);
          setProgress(100);
          
          // Show the report
          setTimeout(() => {
            setIsAnalyzing(false);
            setAnalysisComplete(true);
          }, 500);
        } else {
          // No reports found
          clearInterval(progressInterval);
          setError('No reports found. Please upload a report first.');
          setIsAnalyzing(false);
        }
      } catch (error) {
        console.error('Error fetching report:', error);
        setError('Failed to fetch report. Please try again.');
        setIsAnalyzing(false);
      }
    };
    
    fetchLatestReport();
  }, []);
  
  // Handle asking AI a question about the report
  const handleAskAi = async () => {
    if (!aiQuestion || !report) return;
    
    setIsAskingAi(true);
    
    try {
      // Prepare patient context from report data
      const patientContext = {
        name: report.patientName || 'Unknown',
        age: report.patientDOB ? calculateAge(report.patientDOB.toString()) : 'Unknown',
        gender: 'Unknown', // patientGender is not in MedicalReport type
        medicalHistory: [], // patientHistory is not in MedicalReport type
        currentMedications: [] // medications is not in MedicalReport type
      };

      // Call the AI API endpoint with enhanced options
      const response = await fetch('/api/ai', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          question: aiQuestion,
          report: report,
          conversationHistory: conversationHistory,
          patientContext: patientContext,
          includeReferences: true,
          detailedExplanation: true
        }),
      });
      
      if (!response.ok) {
        throw new Error('Failed to get AI response');
      }
      
      const data = await response.json();
      
      if (data.success && data.data) {
        // Store the complete AI response
        setAiResponse(data.data);
        setAiAnswer(data.data.answer);
        
        // Update conversation history
        setConversationHistory(prev => [
          ...prev, 
          {question: aiQuestion, answer: data.data.answer}
        ]);
      } else {
        throw new Error(data.message || 'Failed to process question');
      }
    } catch (error) {
      console.error('Error asking AI:', error);
      setAiAnswer('Sorry, I encountered an error while processing your question. Please try again.');
    } finally {
      setIsAskingAi(false);
    }
  };

  // Handle voice input from the VoiceInterface component
  const handleVoiceInput = (text: string) => {
    setAiQuestion(text);
    // Auto-submit if we have text from voice
    if (text && report) {
      handleAskAi();
    }
  };

  // Handle playing voice response
  const handleVoiceResponse = async () => {
    if (!aiAnswer) return;
    
    try {
      // Use the stored playAudioResponseFn from VoiceInterface if available
      if (window.playAudioResponseFn) {
        await window.playAudioResponseFn(aiAnswer);
      } else {
        // Fallback to direct API call if function is not available
        const response = await fetch('/api/voice', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            text: aiAnswer,
            voiceOptions: {
              gender: 'neutral',
              speed: 1.0
            }
          }),
        });
        
        if (!response.ok) {
          throw new Error('Failed to generate voice response');
        }
        
        // The response is an audio blob
        const audioBlob = await response.blob();
        const audioUrl = URL.createObjectURL(audioBlob);
        
        // Play the audio
        const audio = new Audio(audioUrl);
        audio.play();
      }
    } catch (error) {
      console.error('Error generating voice response:', error);
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

  return (
    <DashboardLayout activePage="reports">
      <div className="mb-6 flex items-center">
        <Link href="/dashboard/reports" className="text-accent hover:underline mr-4">
          ← Back to Reports
        </Link>
        <h1 className="text-2xl font-bold">{report?.title || 'Medical Report Analysis'}</h1>
      </div>

      {isAnalyzing ? (
        <Card className="text-center py-12">
          <div className="flex flex-col items-center">
            <div className="relative h-32 w-32 mb-6">
              <div className="absolute inset-0 rounded-full border-4 border-gray-700"></div>
              <div 
                className="absolute inset-0 rounded-full border-4 border-accent animate-pulse-slow"
                style={{ 
                  clipPath: `path('M 50,50 m 0,-${45 * progress / 100} a ${45 * progress / 100},${45 * progress / 100} 0 1 1 0,${2 * 45 * progress / 100} a ${45 * progress / 100},${45 * progress / 100} 0 1 1 0,-${2 * 45 * progress / 100}')`
                }}
              ></div>
              <div className="absolute inset-0 flex items-center justify-center text-2xl font-bold">
                {Math.round(progress)}%
              </div>
            </div>
            <h2 className="text-xl font-medium mb-2">Analyzing Your Report</h2>
            <p className="text-gray-400 max-w-md">
              Our AI is processing your medical report to provide insights, identify abnormalities, and generate recommendations.
            </p>
          </div>
        </Card>
      ) : error ? (
        <Card className="text-center py-12">
          <div className="flex flex-col items-center">
            <div className="h-16 w-16 rounded-full bg-danger/20 flex items-center justify-center text-danger text-2xl mb-6">
              !
            </div>
            <h2 className="text-xl font-medium mb-2">Error</h2>
            <p className="text-gray-400 max-w-md mb-6">{error}</p>
            <Button variant="primary" onClick={() => router.push('/dashboard/upload')}>
              Upload a Report
            </Button>
          </div>
        </Card>
      ) : !report ? (
        <Card className="text-center py-12">
          <div className="flex flex-col items-center">
            <div className="h-16 w-16 rounded-full bg-danger/20 flex items-center justify-center text-danger text-2xl mb-6">
              !
            </div>
            <h2 className="text-xl font-medium mb-2">No Report Found</h2>
            <p className="text-gray-400 max-w-md mb-6">We couldn't find any reports to analyze. Please upload a report first.</p>
            <Button variant="primary" onClick={() => router.push('/dashboard/upload')}>
              Upload a Report
            </Button>
          </div>
        </Card>
      ) : (
        <div className="space-y-6">
          {/* Report Header */}
          <Card>
            <div className="flex flex-col md:flex-row md:items-center justify-between">
              <div>
                <div className="text-sm text-gray-400 mb-1">{report.type}</div>
                <h2 className="text-xl font-medium">{report.title}</h2>
                <div className="mt-2 text-sm text-gray-400">
                  Date: {new Date(report.uploadDate).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}
                </div>
              </div>
              
              <div className="mt-4 md:mt-0">
                <div className="flex flex-col items-end">
                  <div className="text-sm">Patient: <span className="text-gray-300">{report.patientName || 'Not specified'}</span></div>
                  <div className="text-sm">Provider: <span className="text-gray-300">{report.provider || 'Not specified'}</span></div>
                  <div className="text-sm">Status: <span className="text-gray-300">{report.status}</span></div>
                </div>
              </div>
            </div>
          </Card>
              
          {/* Results Table */}
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
                  {report.results && report.results.map((result, index) => (
                    <tr key={index} className="border-b border-gray-800 last:border-0">
                      <td className="py-3 px-4">{result.name}</td>
                      <td className="py-3 px-4 font-medium">{result.value}</td>
                      <td className="py-3 px-4 text-gray-400">{result.unit}</td>
                      <td className="py-3 px-4 text-gray-400">
                        {result.referenceRange ? `${result.referenceRange.min}-${result.referenceRange.max} ${result.unit || ''}` : 'Not specified'}
                      </td>
                      <td className="py-3 px-4">
                        <span className={`px-2 py-1 rounded-full text-xs ${getStatusBg(result.status || 'normal')} ${getStatusColor(result.status || 'normal')}`}>
                          {result.status ? (result.status.charAt(0).toUpperCase() + result.status.slice(1)) : 'Normal'}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </Card>
              
          {/* AI Analysis */}
          <Card>
            <div className="flex items-center mb-4">
              <div className="h-8 w-8 rounded-full bg-accent/20 flex items-center justify-center text-accent mr-3">
                AI
              </div>
              <h3 className="text-lg font-medium">AI Analysis</h3>
              {report.analysis?.aiConfidenceScore && (
                <div className="ml-auto text-sm text-gray-400">
                  Confidence Score: 
                  <span className={`ml-1 ${report.analysis.aiConfidenceScore > 0.8 ? 'text-success' : 
                                     report.analysis.aiConfidenceScore > 0.6 ? 'text-warning' : 'text-danger'}`}>
                    {Math.round(report.analysis.aiConfidenceScore * 100)}%
                  </span>
                </div>
              )}
            </div>
            
            {report.analysis ? (
              <>
                <div className="mb-6">
                  <h4 className="text-sm font-medium text-gray-400 mb-2">Summary</h4>
                  <p>{report.analysis.summary}</p>
                </div>
                
                {report.analysis.findings && report.analysis.findings.length > 0 && (
                  <div className="mb-6">
                    <h4 className="text-sm font-medium text-gray-400 mb-2">Key Findings</h4>
                    <ul className="space-y-2">
                      {report.analysis.findings.map((finding, index) => (
                        <li key={index} className="flex items-start">
                          <span className="text-accent mr-2">•</span>
                          <span>{finding}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                )}
                
                {report.analysis.possibleConditions && report.analysis.possibleConditions.length > 0 && (
                  <div className="mb-6">
                    <h4 className="text-sm font-medium text-gray-400 mb-2">Possible Conditions</h4>
                    <div className="space-y-3">
                      {report.analysis.possibleConditions.map((condition, index) => (
                        <div key={index} className="bg-card-hover p-3 rounded-lg">
                          <div className="flex justify-between items-center mb-1">
                            <div className="font-medium">{condition.name}</div>
                            <div className="text-sm text-gray-400">
                              Probability: {typeof condition.probability === 'number' 
                                ? `${Math.round(condition.probability * 100)}%` 
                                : condition.probability}
                            </div>
                          </div>
                          <p className="text-sm text-gray-300">{condition.description}</p>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
                
                {report.analysis.recommendations && report.analysis.recommendations.length > 0 && (
                  <div>
                    <h4 className="text-sm font-medium text-gray-400 mb-2">Recommendations</h4>
                    <ul className="space-y-2">
                      {report.analysis.recommendations.map((recommendation, index) => (
                        <li key={index} className="flex items-start">
                          <span className="text-accent mr-2">•</span>
                          <span>{recommendation}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                )}
                
                {report.analysis.followUpRecommended && (
                  <div className="mt-6 p-3 bg-warning/10 rounded-lg">
                    <div className="flex items-center">
                      <div className="h-6 w-6 rounded-full bg-warning/20 flex items-center justify-center text-warning mr-2">
                        !
                      </div>
                      <div>
                        <span className="font-medium text-warning">Follow-up Recommended</span>
                        {report.analysis.followUpTimeframe && (
                          <span className="ml-2 text-gray-400">within {report.analysis.followUpTimeframe}</span>
                        )}
                      </div>
                    </div>
                  </div>
                )}
              </>
            ) : (
              <div className="text-center py-6">
                <p className="text-gray-400">No AI analysis available for this report.</p>
              </div>
            )}
          </Card>
              
          {/* Ask AI */}
          <Card>
            <h3 className="text-lg font-medium mb-4">Ask AI About This Report</h3>
            
            <div className="mb-4">
              <div className="flex">
                <input
                  type="text"
                  value={aiQuestion}
                  onChange={(e) => setAiQuestion(e.target.value)}
                  placeholder="Ask a question about your report..."
                  className="flex-1 bg-card-hover border border-gray-700 rounded-l-lg px-4 py-2 focus:outline-none focus:ring-1 focus:ring-accent"
                  disabled={isAskingAi}
                />
                <Button
                  variant="primary"
                  className="rounded-l-none"
                  onClick={handleAskAi}
                  disabled={!aiQuestion || isAskingAi}
                >
                  {isAskingAi ? 'Processing...' : 'Ask'}
                </Button>
              </div>
              
              {/* Voice Interface */}
              <div className="mt-4">
                <VoiceInterface 
                  onTextInput={handleVoiceInput} 
                  onVoiceResponse={(playAudioFn) => {
                    // Store the function for later use in handleVoiceResponse
                    window.playAudioResponseFn = playAudioFn;
                  }}
                  isProcessing={isAskingAi} 
                  className="w-full"
                />
              </div>
            </div>
            
            {aiAnswer && (
              <div className="p-4 bg-card-hover rounded-lg">
                <div className="flex items-start">
                  <div className="h-8 w-8 rounded-full bg-accent/20 flex items-center justify-center text-accent mr-3 mt-1">
                    AI
                  </div>
                  <div className="flex-1">
                    <p className="text-sm text-gray-400 mb-1">Your question:</p>
                    <p className="mb-3 font-medium">{aiQuestion}</p>
                    <p className="text-sm text-gray-400 mb-1">AI response:</p>
                    <p>{aiAnswer}</p>
                    
                    {/* References section if available */}
                    {aiResponse?.references && aiResponse.references.length > 0 && (
                      <div className="mt-4 border-t border-gray-700 pt-3">
                        <p className="text-sm text-gray-400 mb-2">References:</p>
                        <ul className="text-sm text-gray-300">
                          {aiResponse.references.map((ref: any, index: number) => (
                            <li key={index} className="mb-1">
                              <span className="text-accent mr-1">•</span>
                              {ref.text} <span className="text-gray-500">{ref.location}</span>
                            </li>
                          ))}
                        </ul>
                      </div>
                    )}
                    
                    {/* Suggested follow-ups if available */}
                    {aiResponse?.suggestedFollowUps && aiResponse.suggestedFollowUps.length > 0 && (
                      <div className="mt-4 border-t border-gray-700 pt-3">
                        <p className="text-sm text-gray-400 mb-2">Suggested follow-up questions:</p>
                        <div className="flex flex-wrap gap-2">
                          {aiResponse.suggestedFollowUps.map((question: string, index: number) => (
                            <button
                              key={index}
                              className="text-sm bg-card-hover hover:bg-gray-700 px-3 py-1 rounded-full text-accent"
                              onClick={() => {
                                setAiQuestion(question);
                                handleAskAi();
                              }}
                            >
                              {question}
                            </button>
                          ))}
                        </div>
                      </div>
                    )}
                    
                    {/* Voice playback button */}
                    <div className="mt-4 flex justify-end">
                      <Button
                        variant="secondary"
                        size="sm"
                        onClick={handleVoiceResponse}
                        className="flex items-center"
                      >
                        <span className="mr-2">🔊</span>
                        Listen
                      </Button>
                    </div>
                  </div>
                </div>
              </div>
            )}
            
            {/* Conversation history */}
            {conversationHistory.length > 1 && (
              <div className="mt-6 border-t border-gray-700 pt-4">
                <h4 className="text-sm font-medium text-gray-400 mb-3">Conversation History</h4>
                <div className="space-y-4 max-h-80 overflow-y-auto pr-2">
                  {conversationHistory.slice(0, -1).map((exchange, index) => (
                    <div key={index} className="p-3 bg-card-hover rounded-lg">
                      <p className="text-sm text-gray-400 mb-1">Q:</p>
                      <p className="mb-2 text-sm">{exchange.question}</p>
                      <p className="text-sm text-gray-400 mb-1">A:</p>
                      <p className="text-sm text-gray-300">{exchange.answer}</p>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </Card>
          
          {/* Actions */}
          <div className="flex flex-col sm:flex-row gap-4">
            <Button variant="secondary" fullWidth className="flex-1" onClick={() => window.print()}>
              <span className="mr-2">📥</span>
              Download PDF Report
            </Button>
            <Button 
              variant="secondary" 
              fullWidth 
              className="flex-1"
              onClick={() => router.push('/dashboard/upload')}
            >
              <span className="mr-2">📤</span>
              Upload Another Report
            </Button>
          </div>
        </div>
      )}
    </DashboardLayout>
  );
}