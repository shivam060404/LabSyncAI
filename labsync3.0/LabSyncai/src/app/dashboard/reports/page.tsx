'use client';

import { useState } from 'react';
import Link from 'next/link';
import { DashboardLayout } from '@/components/layout';
import { Card, Button } from '@/components/ui';

type Report = {
  id: string;
  name: string;
  type: string;
  date: string;
  status: 'normal' | 'abnormal' | 'critical';
  highlights: string[];
};

export default function Reports() {
  const [searchTerm, setSearchTerm] = useState('');
  const [filterType, setFilterType] = useState('all');
  const [filterStatus, setFilterStatus] = useState('all');
  
  // Mock data for reports
  const reports: Report[] = [
    {
      id: 'r1',
      name: 'Complete Blood Count',
      type: 'blood',
      date: '2023-12-15',
      status: 'normal',
      highlights: ['All values within normal range', 'Slight increase in white blood cells']
    },
    {
      id: 'r2',
      name: 'Lipid Panel',
      type: 'blood',
      date: '2023-11-28',
      status: 'abnormal',
      highlights: ['Elevated LDL cholesterol', 'Triglycerides above normal range']
    },
    {
      id: 'r3',
      name: 'Chest X-Ray',
      type: 'imaging',
      date: '2023-10-05',
      status: 'normal',
      highlights: ['No abnormalities detected', 'Lungs clear']
    },
    {
      id: 'r4',
      name: 'ECG Report',
      type: 'cardiac',
      date: '2023-09-20',
      status: 'critical',
      highlights: ['Irregular heartbeat detected', 'Signs of atrial fibrillation']
    },
    {
      id: 'r5',
      name: 'Thyroid Function Test',
      type: 'endocrine',
      date: '2023-08-12',
      status: 'abnormal',
      highlights: ['TSH levels elevated', 'T4 within normal range']
    },
  ];
  
  // Filter reports based on search term and filters
  const filteredReports = reports.filter(report => {
    const matchesSearch = report.name.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesType = filterType === 'all' || report.type === filterType;
    const matchesStatus = filterStatus === 'all' || report.status === filterStatus;
    
    return matchesSearch && matchesType && matchesStatus;
  });
  
  const getStatusColor = (status: Report['status']) => {
    switch (status) {
      case 'normal':
        return 'text-success';
      case 'abnormal':
        return 'text-warning';
      case 'critical':
        return 'text-danger';
      default:
        return 'text-gray-400';
    }
  };
  
  const getStatusBg = (status: Report['status']) => {
    switch (status) {
      case 'normal':
        return 'bg-success/10';
      case 'abnormal':
        return 'bg-warning/10';
      case 'critical':
        return 'bg-danger/10';
      default:
        return 'bg-gray-700';
    }
  };

  return (
    <DashboardLayout activePage="reports">
          <div className="mb-8">
            <h1 className="text-3xl font-bold">Medical Reports</h1>
            <p className="text-gray-400 mt-2">View and analyze your medical reports</p>
          </div>

          {/* Search and Filters */}
          <Card className="mb-6">
            <div className="flex flex-col md:flex-row gap-4">
              <div className="flex-1">
                <div className="relative">
                  <input
                    type="text"
                    placeholder="Search reports..."
                    className="input w-full pl-10"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                  />
                  <div className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400">
                    🔍
                  </div>
                </div>
              </div>
              
              <div className="flex gap-4">
                <div className="w-40">
                  <select
                    className="input w-full"
                    value={filterType}
                    onChange={(e) => setFilterType(e.target.value)}
                  >
                    <option value="all">All Types</option>
                    <option value="blood">Blood</option>
                    <option value="imaging">Imaging</option>
                    <option value="cardiac">Cardiac</option>
                    <option value="endocrine">Endocrine</option>
                  </select>
                </div>
                
                <div className="w-40">
                  <select
                    className="input w-full"
                    value={filterStatus}
                    onChange={(e) => setFilterStatus(e.target.value)}
                  >
                    <option value="all">All Status</option>
                    <option value="normal">Normal</option>
                    <option value="abnormal">Abnormal</option>
                    <option value="critical">Critical</option>
                  </select>
                </div>
              </div>
            </div>
          </Card>

          {/* Reports List */}
          <div className="space-y-4">
            {filteredReports.length > 0 ? (
              filteredReports.map(report => (
                <Link href={`/dashboard/reports/${report.id}`} key={report.id}>
                  <Card hoverable className="cursor-pointer">
                    <div className="flex flex-col md:flex-row md:items-center justify-between">
                      <div>
                        <h3 className="text-xl font-medium">{report.name}</h3>
                        <div className="flex items-center mt-2 text-sm text-gray-400">
                          <span className="capitalize mr-4">{report.type}</span>
                          <span>{new Date(report.date).toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' })}</span>
                        </div>
                      </div>
                      
                      <div className="mt-4 md:mt-0 flex items-center">
                        <div className={`px-3 py-1 rounded-full text-sm ${getStatusBg(report.status)} ${getStatusColor(report.status)}`}>
                          {report.status.charAt(0).toUpperCase() + report.status.slice(1)}
                        </div>
                      </div>
                    </div>
                    
                    <div className="mt-4 pt-4 border-t border-gray-800">
                      <h4 className="text-sm font-medium text-gray-400 mb-2">Key Findings:</h4>
                      <ul className="text-sm space-y-1">
                        {report.highlights.map((highlight, index) => (
                          <li key={index} className="flex items-start">
                            <span className="mr-2">•</span>
                            <span>{highlight}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  </Card>
                </Link>
              ))
            ) : (
              <Card className="text-center py-12">
                <div className="text-4xl mb-4">📋</div>
                <h3 className="text-xl font-medium mb-2">No reports found</h3>
                <p className="text-gray-400 mb-6">Try adjusting your search or filters</p>
                <Link href="/dashboard/upload" className="inline-block">
          <Button variant="primary">
            Upload New Report
          </Button>
        </Link>
              </Card>
            )}
          </div>
    </DashboardLayout>
  );
}