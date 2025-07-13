'use client';

import { useState } from 'react';
import Link from 'next/link';
import { DashboardLayout } from '@/components/layout';
import { Card, Button, Input } from '@/components/ui';

export default function Profile() {
  // User profile state
  const [user, setUser] = useState({
    name: 'John Smith',
    email: 'john.smith@example.com',
    age: 42,
    gender: 'Male',
    location: 'New York, NY',
    phone: '+1 (555) 123-4567',
    emergencyContact: 'Jane Smith',
    emergencyPhone: '+1 (555) 987-6543',
    bloodType: 'O+',
    allergies: ['Penicillin', 'Peanuts'],
    conditions: ['Hypertension', 'Type 2 Diabetes'],
    medications: ['Lisinopril 10mg', 'Metformin 500mg'],
    height: 180, // cm
    weight: 85, // kg
  });
  
  const [isEditing, setIsEditing] = useState(false);
  const [editedUser, setEditedUser] = useState(user);
  const [newAllergy, setNewAllergy] = useState('');
  const [newCondition, setNewCondition] = useState('');
  const [newMedication, setNewMedication] = useState('');
  
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setEditedUser(prev => ({
      ...prev,
      [name]: value
    }));
  };
  
  const addAllergy = () => {
    if (newAllergy.trim()) {
      setEditedUser(prev => ({
        ...prev,
        allergies: [...prev.allergies, newAllergy.trim()]
      }));
      setNewAllergy('');
    }
  };
  
  const removeAllergy = (index: number) => {
    setEditedUser(prev => ({
      ...prev,
      allergies: prev.allergies.filter((_, i) => i !== index)
    }));
  };
  
  const addCondition = () => {
    if (newCondition.trim()) {
      setEditedUser(prev => ({
        ...prev,
        conditions: [...prev.conditions, newCondition.trim()]
      }));
      setNewCondition('');
    }
  };
  
  const removeCondition = (index: number) => {
    setEditedUser(prev => ({
      ...prev,
      conditions: prev.conditions.filter((_, i) => i !== index)
    }));
  };
  
  const addMedication = () => {
    if (newMedication.trim()) {
      setEditedUser(prev => ({
        ...prev,
        medications: [...prev.medications, newMedication.trim()]
      }));
      setNewMedication('');
    }
  };
  
  const removeMedication = (index: number) => {
    setEditedUser(prev => ({
      ...prev,
      medications: prev.medications.filter((_, i) => i !== index)
    }));
  };
  
  const handleSave = () => {
    setUser(editedUser);
    setIsEditing(false);
  };
  
  const handleCancel = () => {
    setEditedUser(user);
    setIsEditing(false);
  };
  
  const calculateBMI = () => {
    const heightInMeters = user.height / 100;
    const bmi = user.weight / (heightInMeters * heightInMeters);
    return bmi.toFixed(1);
  };
  
  const getBMICategory = () => {
    const bmi = parseFloat(calculateBMI());
    if (bmi < 18.5) return { category: 'Underweight', color: 'text-warning' };
    if (bmi < 25) return { category: 'Normal', color: 'text-success' };
    if (bmi < 30) return { category: 'Overweight', color: 'text-warning' };
    return { category: 'Obese', color: 'text-danger' };
  };

  return (
    <DashboardLayout activePage="profile">
      {/* Main Content */}
      <main className="flex-1 p-6 overflow-y-auto">
          <div className="mb-8 flex justify-between items-center">
            <div>
              <h1 className="text-3xl font-bold">Profile</h1>
              <p className="text-gray-400 mt-2">Manage your personal and medical information</p>
            </div>
            
            {!isEditing ? (
              <Button 
                onClick={() => setIsEditing(true)}
                variant="primary"
              >
                Edit Profile
              </Button>
            ) : (
              <div className="flex space-x-3">
                <Button 
                  onClick={handleCancel}
                  variant="secondary"
                >
                  Cancel
                </Button>
                <Button 
                  onClick={handleSave}
                  variant="primary"
                >
                  Save Changes
                </Button>
              </div>
            )}
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Personal Information */}
            <div className="lg:col-span-2">
              <Card>
                <h2 className="text-xl font-bold mb-6">Personal Information</h2>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-medium mb-1">Full Name</label>
                    {isEditing ? (
                      <input
                        type="text"
                        name="name"
                        value={editedUser.name}
                        onChange={handleInputChange}
                        className="input w-full"
                      />
                    ) : (
                      <div className="text-lg">{user.name}</div>
                    )}
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium mb-1">Email</label>
                    {isEditing ? (
                      <input
                        type="email"
                        name="email"
                        value={editedUser.email}
                        onChange={handleInputChange}
                        className="input w-full"
                      />
                    ) : (
                      <div className="text-lg">{user.email}</div>
                    )}
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium mb-1">Age</label>
                    {isEditing ? (
                      <input
                        type="number"
                        name="age"
                        value={editedUser.age}
                        onChange={handleInputChange}
                        className="input w-full"
                      />
                    ) : (
                      <div className="text-lg">{user.age} years</div>
                    )}
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium mb-1">Gender</label>
                    {isEditing ? (
                      <select
                        name="gender"
                        value={editedUser.gender}
                        onChange={handleInputChange}
                        className="w-full p-3 bg-card-hover border border-gray-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-accent"
                      >
                        <option value="Male">Male</option>
                        <option value="Female">Female</option>
                        <option value="Other">Other</option>
                        <option value="Prefer not to say">Prefer not to say</option>
                      </select>
                    ) : (
                      <div className="text-lg">{user.gender}</div>
                    )}
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium mb-1">Location</label>
                    {isEditing ? (
                      <input
                        type="text"
                        name="location"
                        value={editedUser.location}
                        onChange={handleInputChange}
                        className="input w-full"
                      />
                    ) : (
                      <div className="text-lg">{user.location}</div>
                    )}
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium mb-1">Phone Number</label>
                    {isEditing ? (
                      <input
                        type="tel"
                        name="phone"
                        value={editedUser.phone}
                        onChange={handleInputChange}
                        className="input w-full"
                      />
                    ) : (
                      <div className="text-lg">{user.phone}</div>
                    )}
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium mb-1">Emergency Contact</label>
                    {isEditing ? (
                      <input
                        type="text"
                        name="emergencyContact"
                        value={editedUser.emergencyContact}
                        onChange={handleInputChange}
                        className="input w-full"
                      />
                    ) : (
                      <div className="text-lg">{user.emergencyContact}</div>
                    )}
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium mb-1">Emergency Phone</label>
                    {isEditing ? (
                      <input
                        type="tel"
                        name="emergencyPhone"
                        value={editedUser.emergencyPhone}
                        onChange={handleInputChange}
                        className="input w-full"
                      />
                    ) : (
                      <div className="text-lg">{user.emergencyPhone}</div>
                    )}
                  </div>
                </div>
              </Card>
            </div>
            
            {/* Health Stats */}
            <div>
              <Card>
                <h2 className="text-xl font-bold mb-6">Health Stats</h2>
                
                <div className="space-y-6">
                  <div>
                    <label className="block text-sm font-medium mb-1">Height</label>
                    {isEditing ? (
                      <div className="flex items-center">
                        <input
                          type="number"
                          name="height"
                          value={editedUser.height}
                          onChange={handleInputChange}
                          className="input w-full"
                        />
                        <span className="ml-2">cm</span>
                      </div>
                    ) : (
                      <div className="text-lg">{user.height} cm</div>
                    )}
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium mb-1">Weight</label>
                    {isEditing ? (
                      <div className="flex items-center">
                        <input
                          type="number"
                          name="weight"
                          value={editedUser.weight}
                          onChange={handleInputChange}
                          className="input w-full"
                        />
                        <span className="ml-2">kg</span>
                      </div>
                    ) : (
                      <div className="text-lg">{user.weight} kg</div>
                    )}
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium mb-1">BMI</label>
                    <div className="text-lg">
                      {calculateBMI()} - <span className={getBMICategory().color}>{getBMICategory().category}</span>
                    </div>
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium mb-1">Blood Type</label>
                    {isEditing ? (
                      <select
                        name="bloodType"
                        value={editedUser.bloodType}
                        onChange={handleInputChange}
                        className="input w-full"
                      >
                        <option value="A+">A+</option>
                        <option value="A-">A-</option>
                        <option value="B+">B+</option>
                        <option value="B-">B-</option>
                        <option value="AB+">AB+</option>
                        <option value="AB-">AB-</option>
                        <option value="O+">O+</option>
                        <option value="O-">O-</option>
                        <option value="Unknown">Unknown</option>
                      </select>
                    ) : (
                      <div className="text-lg">{user.bloodType}</div>
                    )}
                  </div>
                </div>
              </Card>
            </div>
            
            {/* Medical Information */}
            <div className="lg:col-span-3">
              <Card>
                <h2 className="text-xl font-bold mb-6">Medical Information</h2>
                
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  {/* Allergies */}
                  <div>
                    <label className="block text-sm font-medium mb-3">Allergies</label>
                    <div className="space-y-3">
                      {(isEditing ? editedUser.allergies : user.allergies).map((allergy, index) => (
                        <div key={index} className="flex items-center justify-between bg-card-hover p-2 rounded">
                          <span>{allergy}</span>
                          {isEditing && (
                            <button 
                              onClick={() => removeAllergy(index)}
                              className="text-danger hover:text-danger/80 transition-colors"
                            >
                              ×
                            </button>
                          )}
                        </div>
                      ))}
                      
                      {isEditing && (
                        <div className="flex mt-3">
                          <input
                            type="text"
                            value={newAllergy}
                            onChange={(e) => setNewAllergy(e.target.value)}
                            placeholder="Add allergy"
                            className="input flex-1"
                          />
                          <button 
                            onClick={addAllergy}
                            className="btn-primary ml-2"
                            disabled={!newAllergy.trim()}
                          >
                            +
                          </button>
                        </div>
                      )}
                    </div>
                  </div>
                  
                  {/* Medical Conditions */}
                  <div>
                    <label className="block text-sm font-medium mb-3">Medical Conditions</label>
                    <div className="space-y-3">
                      {(isEditing ? editedUser.conditions : user.conditions).map((condition, index) => (
                        <div key={index} className="flex items-center justify-between bg-card-hover p-2 rounded">
                          <span>{condition}</span>
                          {isEditing && (
                            <button 
                              onClick={() => removeCondition(index)}
                              className="text-danger hover:text-danger/80 transition-colors"
                            >
                              ×
                            </button>
                          )}
                        </div>
                      ))}
                      
                      {isEditing && (
                        <div className="flex mt-3">
                          <input
                            type="text"
                            value={newCondition}
                            onChange={(e) => setNewCondition(e.target.value)}
                            placeholder="Add condition"
                            className="input flex-1"
                          />
                          <button 
                            onClick={addCondition}
                            className="btn-primary ml-2"
                            disabled={!newCondition.trim()}
                          >
                            +
                          </button>
                        </div>
                      )}
                    </div>
                  </div>
                  
                  {/* Medications */}
                  <div>
                    <label className="block text-sm font-medium mb-3">Current Medications</label>
                    <div className="space-y-3">
                      {(isEditing ? editedUser.medications : user.medications).map((medication, index) => (
                        <div key={index} className="flex items-center justify-between bg-card-hover p-2 rounded">
                          <span>{medication}</span>
                          {isEditing && (
                            <button 
                              onClick={() => removeMedication(index)}
                              className="text-danger hover:text-danger/80 transition-colors"
                            >
                              ×
                            </button>
                          )}
                        </div>
                      ))}
                      
                      {isEditing && (
                        <div className="flex mt-3">
                          <input
                            type="text"
                            value={newMedication}
                            onChange={(e) => setNewMedication(e.target.value)}
                            placeholder="Add medication"
                            className="input flex-1"
                          />
                          <button 
                            onClick={addMedication}
                            className="btn-primary ml-2"
                            disabled={!newMedication.trim()}
                          >
                            +
                          </button>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              </Card>
            </div>
            
            {/* Account Settings */}
            <div className="lg:col-span-3">
              <Card>
                <h2 className="text-xl font-bold mb-6">Account Settings</h2>
                
                <div className="space-y-4">
                  <div className="flex items-center justify-between p-4 border border-gray-800 rounded-lg">
                    <div>
                      <h3 className="font-medium">Change Password</h3>
                      <p className="text-sm text-gray-400">Update your account password</p>
                    </div>
                    <Button variant="secondary">Change</Button>
                  </div>
                  
                  <div className="flex items-center justify-between p-4 border border-gray-800 rounded-lg">
                    <div>
                      <h3 className="font-medium">Two-Factor Authentication</h3>
                      <p className="text-sm text-gray-400">Add an extra layer of security to your account</p>
                    </div>
                    <Button variant="secondary">Enable</Button>
                  </div>
                  
                  <div className="flex items-center justify-between p-4 border border-gray-800 rounded-lg">
                    <div>
                      <h3 className="font-medium">Data Export</h3>
                      <p className="text-sm text-gray-400">Download all your medical data</p>
                    </div>
                    <Button variant="secondary">Export</Button>
                  </div>
                  
                  <div className="flex items-center justify-between p-4 border border-danger/30 rounded-lg">
                    <div>
                      <h3 className="font-medium text-danger">Delete Account</h3>
                      <p className="text-sm text-gray-400">Permanently delete your account and all data</p>
                    </div>
                    <Button variant="danger">Delete</Button>
                  </div>
                </div>
              </Card>
            </div>
          </div>
        </main>
    </DashboardLayout>
  );
}