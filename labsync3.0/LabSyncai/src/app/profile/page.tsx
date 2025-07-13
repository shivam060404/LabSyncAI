'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Button, Card, Input } from '@/components/ui';
import { useAuth } from '@/lib/AuthContext';
import { UserProfile } from '@/types';

export default function ProfilePage() {
  const { user, updateProfile, isLoading: authLoading, isAuthenticated } = useAuth();
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const [formData, setFormData] = useState<Partial<UserProfile>>({
    name: '',
    email: '',
    age: undefined,
    gender: undefined,
    location: '',
    region: '',
    state: '',
    bloodType: undefined,
    height: undefined,
    weight: undefined,
    allergies: [],
    conditions: [],
    medications: [],
    emergencyContact: {
      name: '',
      relationship: '',
      phone: ''
    }
  });
  const [customAllergy, setCustomAllergy] = useState('');
  const [customCondition, setCustomCondition] = useState('');
  const [customMedication, setCustomMedication] = useState('');
  const [message, setMessage] = useState({ text: '', type: '' });

  // Common options for select fields
  const bloodTypes = ['A+', 'A-', 'B+', 'B-', 'AB+', 'AB-', 'O+', 'O-', 'unknown'];
  const genderOptions = ['male', 'female', 'other', 'prefer-not-to-say'];
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
  const commonAllergies = [
    'Peanuts',
    'Dairy',
    'Shellfish',
    'Penicillin',
    'Dust Mites',
    'Pollen',
    'None'
  ];
  const indianStates = [
    'Andhra Pradesh',
    'Arunachal Pradesh',
    'Assam',
    'Bihar',
    'Chhattisgarh',
    'Goa',
    'Gujarat',
    'Haryana',
    'Himachal Pradesh',
    'Jharkhand',
    'Karnataka',
    'Kerala',
    'Madhya Pradesh',
    'Maharashtra',
    'Manipur',
    'Meghalaya',
    'Mizoram',
    'Nagaland',
    'Odisha',
    'Punjab',
    'Rajasthan',
    'Sikkim',
    'Tamil Nadu',
    'Telangana',
    'Tripura',
    'Uttar Pradesh',
    'Uttarakhand',
    'West Bengal'
  ];
  const indianRegions = ['North India', 'South India', 'East India', 'West India', 'Northeast India', 'Central India'];

  // Load user data when component mounts
  useEffect(() => {
    if (user) {
      setFormData({
        ...formData,
        ...user,
      });
    } else if (!authLoading && !isAuthenticated) {
      // Redirect to login if not authenticated
      router.push('/auth/login');
    }
  }, [user, authLoading, isAuthenticated, router]);

  // Handle input changes
  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    
    // Handle nested properties (emergency contact)
    if (name.includes('.')) {
      const [parent, child] = name.split('.');
      setFormData({
        ...formData,
        [parent]: {
...(formData[parent as keyof UserProfile] as Record<string, string>),
          [child]: value
        }
      });
    } else {
      setFormData({
        ...formData,
        [name]: value
      });
    }
  };

  // Handle number input changes
  const handleNumberChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value ? parseInt(value, 10) : undefined
    });
  };

  // Toggle array items (conditions, allergies, medications)
  const handleArrayToggle = (array: keyof UserProfile, item: string) => {
    const currentArray = formData[array] as string[] || [];
    
    if (currentArray.includes(item)) {
      setFormData({
        ...formData,
        [array]: currentArray.filter(i => i !== item)
      });
    } else {
      setFormData({
        ...formData,
        [array]: [...currentArray, item]
      });
    }
  };

  // Add custom items to arrays
  const handleAddCustomItem = (array: keyof UserProfile, item: string, setItem: (value: string) => void) => {
    if (item && !(formData[array] as string[] || []).includes(item)) {
      setFormData({
        ...formData,
        [array]: [...(formData[array] as string[] || []), item]
      });
      setItem('');
    }
  };

  // Submit form
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setMessage({ text: '', type: '' });
    
    try {
      const result = await updateProfile(formData);
      
      if (result.success) {
        setMessage({ text: 'Profile updated successfully', type: 'success' });
      } else {
        setMessage({ text: result.message || 'Failed to update profile', type: 'error' });
      }
    } catch (err) {
      console.error(err);
      setMessage({ text: 'An unexpected error occurred', type: 'error' });
    } finally {
      setIsLoading(false);
    }
  };

  if (authLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p>Loading...</p>
      </div>
    );
  }

  return (
    <div className="container mx-auto py-8 px-4">
      <h1 className="text-2xl font-bold mb-6">Your Profile</h1>
      
      <Card className="max-w-4xl mx-auto">
        {message.text && (
          <div className={`mb-4 p-3 rounded ${message.type === 'success' ? 'bg-green-800/20 text-green-400' : 'bg-red-800/20 text-red-400'}`}>
            {message.text}
          </div>
        )}
        
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Basic Information */}
            <div>
              <h2 className="text-xl font-semibold mb-4">Basic Information</h2>
              
              <div className="space-y-4">
                <div>
                  <label htmlFor="name" className="block text-sm font-medium mb-1">
                    Full Name
                  </label>
                  <Input
                    id="name"
                    name="name"
                    type="text"
                    value={formData.name || ''}
                    onChange={handleChange}
                    className="w-full"
                    required
                  />
                </div>
                
                <div>
                  <label htmlFor="email" className="block text-sm font-medium mb-1">
                    Email
                  </label>
                  <Input
                    id="email"
                    name="email"
                    type="email"
                    value={formData.email || ''}
                    onChange={handleChange}
                    className="w-full"
                    required
                    disabled
                  />
                </div>
                
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label htmlFor="age" className="block text-sm font-medium mb-1">
                      Age
                    </label>
                    <Input
                      id="age"
                      name="age"
                      type="number"
                      value={formData.age || ''}
                      onChange={handleNumberChange}
                      className="w-full"
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
                      name="gender"
                      value={formData.gender || ''}
                      onChange={handleChange}
                      className="input w-full"
                    >
                      <option value="" disabled>Select gender</option>
                      {genderOptions.map(option => (
                        <option key={option} value={option}>
                          {option.charAt(0).toUpperCase() + option.slice(1).replace('-', ' ')}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>
              </div>
            </div>
            
            {/* Location Information */}
            <div>
              <h2 className="text-xl font-semibold mb-4">Location Information</h2>
              
              <div className="space-y-4">
                <div>
                  <label htmlFor="location" className="block text-sm font-medium mb-1">
                    City
                  </label>
                  <Input
                    id="location"
                    name="location"
                    type="text"
                    value={formData.location || ''}
                    onChange={handleChange}
                    className="w-full"
                    placeholder="Your city"
                  />
                </div>
                
                <div>
                  <label htmlFor="state" className="block text-sm font-medium mb-1">
                    State
                  </label>
                  <select
                    id="state"
                    name="state"
                    value={formData.state || ''}
                    onChange={handleChange}
                    className="input w-full"
                  >
                    <option value="" disabled>Select state</option>
                    {indianStates.map(state => (
                      <option key={state} value={state}>{state}</option>
                    ))}
                  </select>
                </div>
                
                <div>
                  <label htmlFor="region" className="block text-sm font-medium mb-1">
                    Region
                  </label>
                  <select
                    id="region"
                    name="region"
                    value={formData.region || ''}
                    onChange={handleChange}
                    className="input w-full"
                  >
                    <option value="" disabled>Select region</option>
                    {indianRegions.map(region => (
                      <option key={region} value={region}>{region}</option>
                    ))}
                  </select>
                </div>
              </div>
            </div>
          </div>
          
          <hr className="border-gray-700" />
          
          {/* Health Information */}
          <div>
            <h2 className="text-xl font-semibold mb-4">Health Information</h2>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div>
                <label htmlFor="bloodType" className="block text-sm font-medium mb-1">
                  Blood Type
                </label>
                <select
                  id="bloodType"
                  name="bloodType"
                  value={formData.bloodType || ''}
                  onChange={handleChange}
                  className="input w-full"
                >
                  <option value="" disabled>Select blood type</option>
                  {bloodTypes.map(type => (
                    <option key={type} value={type}>{type}</option>
                  ))}
                </select>
              </div>
              
              <div>
                <label htmlFor="height" className="block text-sm font-medium mb-1">
                  Height (cm)
                </label>
                <Input
                  id="height"
                  name="height"
                  type="number"
                  value={formData.height || ''}
                  onChange={handleNumberChange}
                  className="w-full"
                  min={50}
                  max={250}
                />
              </div>
              
              <div>
                <label htmlFor="weight" className="block text-sm font-medium mb-1">
                  Weight (kg)
                </label>
                <Input
                  id="weight"
                  name="weight"
                  type="number"
                  value={formData.weight || ''}
                  onChange={handleNumberChange}
                  className="w-full"
                  min={1}
                  max={300}
                />
              </div>
            </div>
          </div>
          
          {/* Medical Conditions */}
          <div>
            <label className="block text-sm font-medium mb-3">
              Medical Conditions
            </label>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-4">
              {commonConditions.map((condition) => (
                <div 
                  key={condition}
                  onClick={() => handleArrayToggle('conditions', condition)}
                  className={`cursor-pointer rounded-lg border p-3 text-center text-sm transition-colors ${(formData.conditions || []).includes(condition) ? 'border-accent bg-accent/10 text-accent' : 'border-gray-700 hover:border-gray-500'}`}
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
                onClick={() => handleAddCustomItem('conditions', customCondition, setCustomCondition)}
                variant="secondary"
                disabled={!customCondition}
              >
                Add
              </Button>
            </div>
            
            {(formData.conditions || []).length > 0 && (formData.conditions || []).some(c => !commonConditions.includes(c)) && (
              <div className="mt-3 flex flex-wrap gap-2">
                {(formData.conditions || []).filter(c => !commonConditions.includes(c)).map((condition) => (
                  <div key={condition} className="flex items-center bg-card-hover rounded-full px-3 py-1">
                    <span className="text-sm">{condition}</span>
                    <button
                      type="button"
                      onClick={() => handleArrayToggle('conditions', condition)}
                      className="ml-2 text-gray-400 hover:text-danger"
                    >
                      ×
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>
          
          {/* Allergies */}
          <div>
            <label className="block text-sm font-medium mb-3">
              Allergies
            </label>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-4">
              {commonAllergies.map((allergy) => (
                <div 
                  key={allergy}
                  onClick={() => handleArrayToggle('allergies', allergy)}
                  className={`cursor-pointer rounded-lg border p-3 text-center text-sm transition-colors ${(formData.allergies || []).includes(allergy) ? 'border-accent bg-accent/10 text-accent' : 'border-gray-700 hover:border-gray-500'}`}
                >
                  {allergy}
                </div>
              ))}
            </div>
            
            <div className="flex gap-2">
              <Input
                type="text"
                value={customAllergy}
                onChange={(e) => setCustomAllergy(e.target.value)}
                className="flex-1"
                placeholder="Add other allergy"
              />
              <Button
                type="button"
                onClick={() => handleAddCustomItem('allergies', customAllergy, setCustomAllergy)}
                variant="secondary"
                disabled={!customAllergy}
              >
                Add
              </Button>
            </div>
            
            {(formData.allergies || []).length > 0 && (formData.allergies || []).some(a => !commonAllergies.includes(a)) && (
              <div className="mt-3 flex flex-wrap gap-2">
                {(formData.allergies || []).filter(a => !commonAllergies.includes(a)).map((allergy) => (
                  <div key={allergy} className="flex items-center bg-card-hover rounded-full px-3 py-1">
                    <span className="text-sm">{allergy}</span>
                    <button
                      type="button"
                      onClick={() => handleArrayToggle('allergies', allergy)}
                      className="ml-2 text-gray-400 hover:text-danger"
                    >
                      ×
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>
          
          {/* Medications */}
          <div>
            <label className="block text-sm font-medium mb-3">
              Current Medications
            </label>
            
            <div className="flex gap-2 mb-4">
              <Input
                type="text"
                value={customMedication}
                onChange={(e) => setCustomMedication(e.target.value)}
                className="flex-1"
                placeholder="Add medication"
              />
              <Button
                type="button"
                onClick={() => handleAddCustomItem('medications', customMedication, setCustomMedication)}
                variant="secondary"
                disabled={!customMedication}
              >
                Add
              </Button>
            </div>
            
            {(formData.medications || []).length > 0 && (
              <div className="flex flex-wrap gap-2">
                {(formData.medications || []).map((medication) => (
                  <div key={medication} className="flex items-center bg-card-hover rounded-full px-3 py-1">
                    <span className="text-sm">{medication}</span>
                    <button
                      type="button"
                      onClick={() => handleArrayToggle('medications', medication)}
                      className="ml-2 text-gray-400 hover:text-danger"
                    >
                      ×
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>
          
          <hr className="border-gray-700" />
          
          {/* Emergency Contact */}
          <div>
            <h2 className="text-xl font-semibold mb-4">Emergency Contact</h2>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div>
                <label htmlFor="emergencyContact.name" className="block text-sm font-medium mb-1">
                  Contact Name
                </label>
                <Input
                  id="emergencyContact.name"
                  name="emergencyContact.name"
                  type="text"
                  value={formData.emergencyContact?.name || ''}
                  onChange={handleChange}
                  className="w-full"
                />
              </div>
              
              <div>
                <label htmlFor="emergencyContact.relationship" className="block text-sm font-medium mb-1">
                  Relationship
                </label>
                <Input
                  id="emergencyContact.relationship"
                  name="emergencyContact.relationship"
                  type="text"
                  value={formData.emergencyContact?.relationship || ''}
                  onChange={handleChange}
                  className="w-full"
                />
              </div>
              
              <div>
                <label htmlFor="emergencyContact.phone" className="block text-sm font-medium mb-1">
                  Phone Number
                </label>
                <Input
                  id="emergencyContact.phone"
                  name="emergencyContact.phone"
                  type="tel"
                  value={formData.emergencyContact?.phone || ''}
                  onChange={handleChange}
                  className="w-full"
                  placeholder="+91 XXXXX XXXXX"
                />
              </div>
            </div>
          </div>
          
          <div className="pt-4 flex justify-end">
            <Button 
              type="submit" 
              variant="primary"
              disabled={isLoading}
            >
              {isLoading ? 'Saving...' : 'Save Profile'}
            </Button>
          </div>
        </form>
      </Card>
    </div>
  );
}