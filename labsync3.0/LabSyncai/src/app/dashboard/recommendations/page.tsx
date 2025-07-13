'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import DashboardLayout from '@/components/layout/DashboardLayout';
import { Card, Button } from '@/components/ui';
import AskAiHealthAdvice from '@/components/AskAiHealthAdvice';

interface Recommendation {
  id: string;
  title: string;
  description: string;
  category: 'diet' | 'exercise' | 'lifestyle' | 'medication';
  priority: 'high' | 'medium' | 'low';
  basedOn: string;
  date: string;
}

export default function Recommendations() {
  const [loading, setLoading] = useState(true);
  const [recommendations, setRecommendations] = useState<Recommendation[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [activeCategory, setActiveCategory] = useState<string>('all');
  const [patientContext, setPatientContext] = useState({
    name: 'John Doe',
    dob: '1985-06-15',
    previousConditions: ['Hypertension', 'Seasonal allergies'],
    medications: ['Lisinopril 10mg', 'Cetirizine 10mg'],
    lifestyle: {
      exercise: 'Moderate, 2-3 times per week',
      diet: 'Mixed, trying to reduce processed foods',
      smoking: false,
      alcohol: 'Occasional'
    }
  });
  
  // Fetch recommendations
  useEffect(() => {
    const fetchRecommendations = async () => {
      try {
        setLoading(true);
        
        // In a real implementation, this would fetch from an API
        // For now, we'll use mock data
        setTimeout(() => {
          setRecommendations([
            {
              id: '1',
              title: 'Increase Potassium Intake',
              description: 'Based on your recent blood work showing slightly low potassium levels, consider increasing your intake of potassium-rich foods such as bananas, potatoes, spinach, and avocados. This can help maintain proper heart and muscle function.',
              category: 'diet',
              priority: 'medium',
              basedOn: 'Complete Blood Count (04/24/2024)',
              date: '2024-04-25'
            },
            {
              id: '2',
              title: 'Reduce Sodium Consumption',
              description: 'Your blood pressure readings and history of hypertension suggest you would benefit from reducing sodium intake. Aim for less than 2,000mg daily by limiting processed foods, reading food labels, and using herbs and spices instead of salt for flavoring.',
              category: 'diet',
              priority: 'high',
              basedOn: 'Blood Pressure Monitoring (04/20/2024)',
              date: '2024-04-22'
            },
            {
              id: '3',
              title: 'Incorporate Strength Training',
              description: 'Your bone density scan indicates early signs of bone mineral loss. Adding resistance training 2-3 times weekly can help increase bone density and muscle mass. Start with light weights and gradually increase as you build strength.',
              category: 'exercise',
              priority: 'medium',
              basedOn: 'Bone Density Scan (04/15/2024)',
              date: '2024-04-18'
            },
            {
              id: '4',
              title: 'Improve Sleep Hygiene',
              description: 'Your reported sleep patterns and elevated stress markers suggest poor sleep quality. Establish a consistent sleep schedule, create a relaxing bedtime routine, limit screen time before bed, and ensure your sleeping environment is dark and comfortable.',
              category: 'lifestyle',
              priority: 'high',
              basedOn: 'Health Questionnaire (04/10/2024)',
              date: '2024-04-12'
            },
            {
              id: '5',
              title: 'Lisinopril Timing Adjustment',
              description: 'Taking your Lisinopril in the evening rather than morning may help better control your blood pressure throughout the night and early morning hours when cardiovascular events are more common. Discuss this change with your physician before implementing.',
              category: 'medication',
              priority: 'medium',
              basedOn: 'Medication Review (04/05/2024)',
              date: '2024-04-08'
            },
            {
              id: '6',
              title: 'Increase Vitamin D Supplementation',
              description: 'Your lab results show vitamin D levels at the lower end of normal range. Consider increasing your current supplement to 2000 IU daily, especially during winter months with limited sun exposure. This can support bone health and immune function.',
              category: 'medication',
              priority: 'low',
              basedOn: 'Vitamin Panel (03/28/2024)',
              date: '2024-04-01'
            },
            {
              id: '7',
              title: 'Incorporate Mindfulness Practice',
              description: 'Your elevated cortisol levels and reported stress symptoms suggest implementing a daily mindfulness practice could be beneficial. Start with 5-10 minutes of meditation, deep breathing, or guided relaxation daily to help manage stress levels.',
              category: 'lifestyle',
              priority: 'medium',
              basedOn: 'Stress Hormone Panel (03/20/2024)',
              date: '2024-03-25'
            },
            {
              id: '8',
              title: 'Increase Aerobic Exercise Duration',
              description: 'Your cardiovascular fitness assessment indicates room for improvement. Consider gradually increasing your current exercise sessions from 20 minutes to 30-45 minutes, 3-4 times weekly, to improve heart health and endurance.',
              category: 'exercise',
              priority: 'medium',
              basedOn: 'Fitness Assessment (03/15/2024)',
              date: '2024-03-18'
            }
          ]);
          setLoading(false);
        }, 1500);
      } catch (error) {
        console.error('Error fetching recommendations:', error);
        setError('Failed to fetch recommendations. Please try again.');
        setLoading(false);
      }
    };
    
    fetchRecommendations();
  }, []);
  
  // Filter recommendations by category
  const filteredRecommendations = activeCategory === 'all' 
    ? recommendations 
    : recommendations.filter(rec => rec.category === activeCategory);

  return (
    <DashboardLayout activePage="recommendations">
      <div className="mb-6 flex items-center justify-between">
        <h1 className="text-2xl font-bold">Personalized Recommendations</h1>
        <Link href="/dashboard/health-plans" className="inline-block">
          <Button variant="secondary">
            <span className="mr-2">📋</span> View Health Plans
          </Button>
        </Link>
      </div>

      <div className="mb-6">
        <div className="flex flex-wrap gap-2">
          <Button 
            variant={activeCategory === 'all' ? 'primary' : 'secondary'}
            size="sm"
            onClick={() => setActiveCategory('all')}
          >
            All
          </Button>
          <Button 
            variant={activeCategory === 'diet' ? 'primary' : 'secondary'}
            size="sm"
            onClick={() => setActiveCategory('diet')}
          >
            Diet
          </Button>
          <Button 
            variant={activeCategory === 'exercise' ? 'primary' : 'secondary'}
            size="sm"
            onClick={() => setActiveCategory('exercise')}
          >
            Exercise
          </Button>
          <Button 
            variant={activeCategory === 'lifestyle' ? 'primary' : 'secondary'}
            size="sm"
            onClick={() => setActiveCategory('lifestyle')}
          >
            Lifestyle
          </Button>
          <Button 
            variant={activeCategory === 'medication' ? 'primary' : 'secondary'}
            size="sm"
            onClick={() => setActiveCategory('medication')}
          >
            Medication
          </Button>
        </div>
      </div>

      {loading ? (
        <Card className="text-center py-12">
          <div className="flex flex-col items-center">
            <div className="h-12 w-12 rounded-full border-4 border-accent border-t-transparent animate-spin mb-6"></div>
            <h2 className="text-xl font-medium mb-2">Loading Recommendations</h2>
            <p className="text-gray-400 max-w-md">
              Retrieving your personalized health recommendations...
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
      ) : filteredRecommendations.length === 0 ? (
        <Card className="text-center py-12">
          <div className="flex flex-col items-center">
            <div className="h-16 w-16 rounded-full bg-accent/20 flex items-center justify-center text-accent text-2xl mb-6">
              🔍
            </div>
            <h2 className="text-xl font-medium mb-2">No Recommendations Found</h2>
            <p className="text-gray-400 max-w-md mb-6">
              {activeCategory === 'all' 
                ? "You don't have any personalized recommendations yet." 
                : `No ${activeCategory} recommendations found. Try selecting a different category.`}
            </p>
            {activeCategory !== 'all' && (
              <Button variant="primary" onClick={() => setActiveCategory('all')}>
                View All Categories
              </Button>
            )}
          </div>
        </Card>
      ) : (
        <div className="space-y-6">
          <div className="grid grid-cols-1 gap-6">
            {filteredRecommendations.map((rec) => (
              <Card key={rec.id} className="overflow-hidden">
                <div className="border-b border-gray-800 p-4 flex justify-between items-center">
                  <div className="flex items-center">
                    <div className={`h-3 w-3 rounded-full mr-3 ${rec.priority === 'high' ? 'bg-danger' : rec.priority === 'medium' ? 'bg-warning' : 'bg-success'}`}></div>
                    <div>
                      <div className="text-sm text-gray-400 mb-1 capitalize">{rec.category}</div>
                      <h3 className="text-lg font-medium">{rec.title}</h3>
                    </div>
                  </div>
                  <div className="text-sm text-gray-400">
                    {new Date(rec.date).toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' })}
                  </div>
                </div>
                
                <div className="p-4">
                  <p className="mb-4">{rec.description}</p>
                  
                  <div className="text-sm text-gray-400">
                    Based on: <span className="text-accent">{rec.basedOn}</span>
                  </div>
                </div>
              </Card>
            ))}
          </div>
          
          <div className="mt-8">
            <AskAiHealthAdvice patientContext={patientContext} />
          </div>
        </div>
      )}
    </DashboardLayout>
  );
}