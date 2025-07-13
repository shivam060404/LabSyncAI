'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import DashboardLayout from '@/components/layout/DashboardLayout';
import { Card, Button } from '@/components/ui';
import { HealthPlan } from '@/types';
import VoiceInterface from '@/components/VoiceInterface';

// Add type declaration for the global window object
declare global {
  interface Window {
    playAudioResponseFn?: (text: string) => Promise<void>;
  }
}

export default function HealthPlans() {
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [healthPlans, setHealthPlans] = useState<Array<{
    id: string;
    reportId: string;
    reportType: string;
    reportDate: string;
    healthPlan: HealthPlan;
  }>>([]);
  const [error, setError] = useState<string | null>(null);
  const [activeVoiceId, setActiveVoiceId] = useState<string | null>(null);
  
  // Fetch health plans
  useEffect(() => {
    const fetchHealthPlans = async () => {
      try {
        setLoading(true);
        
        // In a real implementation, this would fetch from an API
        // For now, we'll use mock data
        setTimeout(() => {
          setHealthPlans([
            {
              id: '1',
              reportId: '1',
              reportType: 'Complete Blood Count',
              reportDate: '2024-04-24',
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
            },
            {
              id: '2',
              reportId: '3',
              reportType: 'ECG',
              reportDate: '2024-04-13',
              healthPlan: {
                summary: 'Your ECG shows minor rhythm irregularities that, while not immediately concerning, should be monitored. This health plan focuses on heart health through diet, exercise, and lifestyle modifications.',
                dietaryRecommendations: [
                  'Follow a heart-healthy Mediterranean diet rich in olive oil, nuts, and fish',
                  'Reduce sodium intake to less than 2,300mg daily',
                  'Increase potassium-rich foods like bananas, potatoes, and leafy greens',
                  'Limit caffeine to 200mg daily (about 2 cups of coffee)',
                  'Maintain adequate hydration with 2-3 liters of water daily'
                ],
                exerciseRecommendations: [
                  'Begin with low-intensity walking 20-30 minutes daily',
                  'Gradually increase to moderate aerobic exercise 3-4 times weekly',
                  'Include gentle strength training 2 times per week',
                  'Consider activities that promote relaxation like tai chi or yoga',
                  'Monitor heart rate during exercise and stay within recommended zones'
                ],
                lifestyleChanges: [
                  'Prioritize 7-8 hours of uninterrupted sleep',
                  'Practice daily stress reduction techniques',
                  'Avoid alcohol and eliminate tobacco products completely',
                  'Take regular breaks during prolonged sitting',
                  'Monitor blood pressure weekly if possible'
                ],
                medicationNotes: [
                  'Take all cardiac medications exactly as prescribed',
                  'Do not skip doses or adjust medication without consulting your physician',
                  'Be aware of potential side effects and report them to your doctor'
                ],
                followUpSchedule: 'Schedule a follow-up ECG and cardiology consultation in 3 months',
                goals: [
                  {description: 'Establish regular walking routine', timeframe: '2 weeks'},
                  {description: 'Reduce sodium intake by 30%', timeframe: '1 month'},
                  {description: 'Achieve consistent sleep schedule', timeframe: '3 weeks'},
                  {description: 'Lower resting heart rate by 5-10 bpm', timeframe: '2 months'}
                ]
              }
            }
          ]);
          setLoading(false);
        }, 1500);
      } catch (error) {
        console.error('Error fetching health plans:', error);
        setError('Failed to fetch health plans. Please try again.');
        setLoading(false);
      }
    };
    
    fetchHealthPlans();
  }, []);
  
  // Store the playAudioResponse function from VoiceInterface
  const [playAudioFn, setPlayAudioFn] = useState<((text: string) => Promise<void>) | null>(null);
  
  // Callback to receive the playAudioResponse function from VoiceInterface
  const handleVoiceResponseFn = (fn: (text: string) => Promise<void>) => {
    setPlayAudioFn(fn);
    // Also store it in window for global access
    window.playAudioResponseFn = fn;
  };
  
  // Handle playing voice response for health plan summary
  const handleVoiceResponse = async (planId: string, text: string) => {
    if (activeVoiceId === planId) {
      setActiveVoiceId(null);
      return;
    }
    
    setActiveVoiceId(planId);
    
    try {
      // Use the playAudioFn from VoiceInterface if available
      if (playAudioFn) {
        await playAudioFn(text);
        setActiveVoiceId(null);
      } else {
        // Fallback to direct API call if function is not available
        const response = await fetch('/api/voice', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            text: text,
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
        audio.onended = () => setActiveVoiceId(null);
        audio.play();
      }
    } catch (error) {
      console.error('Error generating voice response:', error);
      setActiveVoiceId(null);
    }
  };

  return (
    <DashboardLayout activePage="health-plans">
      {/* Hidden VoiceInterface component to handle text-to-speech */}
      <div style={{ display: 'none' }}>
        <VoiceInterface 
          onTextInput={() => {}} 
          onVoiceResponse={handleVoiceResponseFn}
        />
      </div>
      
      <div className="mb-6 flex items-center justify-between">
        <h1 className="text-2xl font-bold">Personalized Health Plans</h1>
        <Link href="/dashboard/reports" className="inline-block">
          <Button variant="secondary">
            <span className="mr-2">📋</span> View Reports
          </Button>
        </Link>
      </div>

      {loading ? (
        <Card className="text-center py-12">
          <div className="flex flex-col items-center">
            <div className="h-12 w-12 rounded-full border-4 border-accent border-t-transparent animate-spin mb-6"></div>
            <h2 className="text-xl font-medium mb-2">Loading Health Plans</h2>
            <p className="text-gray-400 max-w-md">
              Retrieving your personalized health plans...
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
            <Button variant="primary" onClick={() => window.location.reload()}>
              Try Again
            </Button>
          </div>
        </Card>
      ) : healthPlans.length === 0 ? (
        <Card className="text-center py-12">
          <div className="flex flex-col items-center">
            <div className="h-16 w-16 rounded-full bg-accent/20 flex items-center justify-center text-accent text-2xl mb-6">
              🌱
            </div>
            <h2 className="text-xl font-medium mb-2">No Health Plans Available</h2>
            <p className="text-gray-400 max-w-md mb-6">
              You don't have any personalized health plans yet. Upload a medical report to get started.
            </p>
            <Button variant="primary" onClick={() => router.push('/dashboard/upload')}>
              Upload a Report
            </Button>
          </div>
        </Card>
      ) : (
        <div className="space-y-8">
          {healthPlans.map((plan) => (
            <Card key={plan.id} className="overflow-hidden">
              <div className="border-b border-gray-800 p-4 flex justify-between items-center">
                <div>
                  <div className="text-sm text-gray-400 mb-1">{plan.reportType}</div>
                  <h3 className="text-lg font-medium">Health Plan</h3>
                  <div className="text-sm text-gray-400 mt-1">
                    Based on report from {new Date(plan.reportDate).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}
                  </div>
                </div>
                <div className="flex space-x-3">
                  <Button 
                    variant="secondary" 
                    size="sm"
                    onClick={() => handleVoiceResponse(plan.id, plan.healthPlan.summary)}
                    className="flex items-center"
                  >
                    <span className="mr-2">{activeVoiceId === plan.id ? '⏹️' : '🔊'}</span>
                    {activeVoiceId === plan.id ? 'Stop' : 'Listen'}
                  </Button>
                  <Link href={`/dashboard/reports/${plan.reportId}`}>
                    <Button variant="primary" size="sm">
                      View Details
                    </Button>
                  </Link>
                </div>
              </div>
              
              <div className="p-4">
                <div className="mb-6">
                  <h4 className="text-sm font-medium text-gray-400 mb-2">Summary</h4>
                  <p>{plan.healthPlan.summary}</p>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <h4 className="text-sm font-medium text-gray-400 mb-3">Dietary Recommendations</h4>
                    <ul className="space-y-2">
                      {plan.healthPlan.dietaryRecommendations.map((item, index) => (
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
                      {plan.healthPlan.exerciseRecommendations.map((item, index) => (
                        <li key={index} className="flex items-start">
                          <span className="text-accent mr-2">•</span>
                          <span>{item}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
                
                <div className="mt-6 grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <h4 className="text-sm font-medium text-gray-400 mb-3">Lifestyle Changes</h4>
                    <ul className="space-y-2">
                      {plan.healthPlan.lifestyleChanges.map((item, index) => (
                        <li key={index} className="flex items-start">
                          <span className="text-accent mr-2">•</span>
                          <span>{item}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                  
                  {plan.healthPlan.medicationNotes && plan.healthPlan.medicationNotes.length > 0 && (
                    <div>
                      <h4 className="text-sm font-medium text-gray-400 mb-3">Medication Notes</h4>
                      <ul className="space-y-2">
                        {plan.healthPlan.medicationNotes.map((item, index) => (
                          <li key={index} className="flex items-start">
                            <span className="text-accent mr-2">•</span>
                            <span>{item}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}
                </div>
                
                {plan.healthPlan.followUpSchedule && (
                  <div className="mt-6 p-3 bg-accent/10 rounded-lg">
                    <div className="flex items-center">
                      <div className="h-6 w-6 rounded-full bg-accent/20 flex items-center justify-center text-accent mr-2">
                        📅
                      </div>
                      <div>
                        <span className="font-medium text-accent">Follow-up Schedule</span>
                        <span className="ml-2 text-gray-300">{plan.healthPlan.followUpSchedule}</span>
                      </div>
                    </div>
                  </div>
                )}
                
                <div className="mt-6">
                  <h4 className="text-sm font-medium text-gray-400 mb-3">Health Goals</h4>
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                    {plan.healthPlan.goals.map((goal, index) => (
                      <div key={index} className="bg-card-hover p-3 rounded-lg">
                        <div className="flex flex-col">
                          <div className="font-medium mb-2">{goal.description}</div>
                          <div className="text-sm bg-accent/10 text-accent px-2 py-1 rounded self-start">
                            {goal.timeframe}
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
                
                <div className="mt-6 flex justify-end">
                  <Button variant="secondary" onClick={() => window.print()}>
                    <span className="mr-2">📥</span>
                    Download PDF
                  </Button>
                </div>
              </div>
            </Card>
          ))}
        </div>
      )}
    </DashboardLayout>
  );
}