'use client';

import { useState } from 'react';
import { Button, Card, Input } from '@/components/ui';

export default function ProfileSetup() {
  const [age, setAge] = useState('');
  const [gender, setGender] = useState('');
  const [location, setLocation] = useState('');
  const [conditions, setConditions] = useState<string[]>([]);
  const [customCondition, setCustomCondition] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  
  const commonConditions = [
    'Hypertension',
    'Diabetes',
    'Asthma',
    'Heart Disease',
    'Arthritis',
    'Thyroid Disorder',
    'Anxiety/Depression',
    'None'
  ];

  const handleConditionToggle = (condition: string) => {
    if (conditions.includes(condition)) {
      setConditions(conditions.filter(c => c !== condition));
    } else {
      setConditions([...conditions, condition]);
    }
  };

  const handleAddCustomCondition = () => {
    if (customCondition && !conditions.includes(customCondition)) {
      setConditions([...conditions, customCondition]);
      setCustomCondition('');
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    
    try {
      // Here we would normally call an API to save the profile data
      console.log('Saving profile:', { age, gender, location, conditions });
      
      // Redirect to dashboard after successful profile setup
      window.location.href = '/dashboard';
    } catch (err) {
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-4">
      <Card className="max-w-2xl w-full">
        <div className="text-center mb-8">
          <h1 className="text-2xl font-bold text-accent mb-2">Complete Your Profile</h1>
          <p className="text-gray-400">This information helps us provide more accurate analysis of your medical reports</p>
        </div>
        
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label htmlFor="age" className="block text-sm font-medium mb-1">
                Age
              </label>
              <Input
                id="age"
                type="number"
                value={age}
                onChange={(e) => setAge(e.target.value)}
                className="w-full"
                required
                min={1}
                max={120}
              />
            </div>
            
            <div>
              <label htmlFor="gender" className="block text-sm font-medium mb-1">
                Gender
              </label>
              <select
                id="gender"
                value={gender}
                onChange={(e) => setGender(e.target.value)}
                className="input w-full"
                required
              >
                <option value="" disabled>Select gender</option>
                <option value="male">Male</option>
                <option value="female">Female</option>
                <option value="other">Other</option>
                <option value="prefer-not-to-say">Prefer not to say</option>
              </select>
            </div>
          </div>
          
          <div>
            <label htmlFor="location" className="block text-sm font-medium mb-1">
              Location
            </label>
            <Input
              id="location"
              type="text"
              value={location}
              onChange={(e) => setLocation(e.target.value)}
              className="w-full"
              placeholder="City, Country"
              required
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium mb-3">
              Existing Medical Conditions
            </label>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-4">
              {commonConditions.map((condition) => (
                <div 
                  key={condition}
                  onClick={() => handleConditionToggle(condition)}
                  className={`cursor-pointer rounded-lg border p-3 text-center text-sm transition-colors ${conditions.includes(condition) ? 'border-accent bg-accent/10 text-accent' : 'border-gray-700 hover:border-gray-500'}`}
                >
                  {condition}
                </div>
              ))}
            </div>
            
            <div className="flex gap-2">
              <Input
                type="text"
                value={customCondition}
                onChange={(e) => setCustomCondition(e.target.value)}
                className="flex-1"
                placeholder="Add other condition"
              />
              <Button
                type="button"
                onClick={handleAddCustomCondition}
                variant="secondary"
                disabled={!customCondition}
              >
                Add
              </Button>
            </div>
            
            {conditions.length > 0 && conditions.some(c => !commonConditions.includes(c)) && (
              <div className="mt-3 flex flex-wrap gap-2">
                {conditions.filter(c => !commonConditions.includes(c)).map((condition) => (
                  <div key={condition} className="flex items-center bg-card-hover rounded-full px-3 py-1">
                    <span className="text-sm">{condition}</span>
                    <button
                      type="button"
                      onClick={() => handleConditionToggle(condition)}
                      className="ml-2 text-gray-400 hover:text-danger"
                    >
                      ×
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>
          
          <div className="pt-4">
            <Button 
              type="submit" 
              variant="primary"
              fullWidth
              disabled={isLoading}
            >
              {isLoading ? 'Saving...' : 'Complete Profile'}
            </Button>
          </div>
        </form>
      </Card>
    </div>
  );
}