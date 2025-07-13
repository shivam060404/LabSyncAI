'use client';

import { useState } from 'react';
import DashboardLayout from '@/components/layout/DashboardLayout';
import { Card, Button, Input } from '@/components/ui';
import TrendAnalysis from '@/components/TrendAnalysis';

export default function TrendsPage() {
  const [patientName, setPatientName] = useState('');
  const [searchedPatient, setSearchedPatient] = useState('');
  const [showAnalysis, setShowAnalysis] = useState(false);
  
  const handleSearch = () => {
    if (patientName.trim()) {
      setSearchedPatient(patientName);
      setShowAnalysis(true);
    }
  };
  
  return (
    <DashboardLayout activePage="trends">
      <div className="mb-6">
        <h1 className="text-2xl font-bold">Longitudinal Health Trends</h1>
        <p className="text-gray-400 mt-1">Track changes in health parameters over time</p>
      </div>
      
      <Card className="mb-6 p-6">
        <h2 className="text-lg font-medium mb-4">Patient Search</h2>
        
        <div className="flex flex-col md:flex-row gap-4">
          <div className="flex-1">
            <label className="block text-sm font-medium text-gray-400 mb-1">Patient Name</label>
            <Input
              type="text"
              value={patientName}
              onChange={(e) => setPatientName(e.target.value)}
              placeholder="Enter patient name"
              className="w-full"
            />
          </div>
          
          <div className="flex items-end">
            <Button variant="primary" onClick={handleSearch} disabled={!patientName.trim()}>
              Search
            </Button>
          </div>
        </div>
        
        <div className="mt-4 text-sm text-gray-400">
          <p>Search for a patient to view their longitudinal health data trends.</p>
          <p className="mt-1">Example patients: John Smith, Jane Doe, Robert Johnson</p>
        </div>
      </Card>
      
      {showAnalysis && searchedPatient && (
        <div className="mb-6">
          <div className="mb-4">
            <h2 className="text-xl font-medium">Trend Analysis for {searchedPatient}</h2>
          </div>
          
          <TrendAnalysis patientName={searchedPatient} />
        </div>
      )}
    </DashboardLayout>
  );
}