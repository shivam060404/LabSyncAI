'use client';

import Link from 'next/link';
import { DashboardLayout } from '@/components/layout';
import { Card, Button } from '@/components/ui';

// Mock data for demonstration
const mockReports = [
  { id: 1, type: 'Blood Test', date: 'Apr 24, 2024', hasHealthPlan: true },
  { id: 2, type: 'X-Ray', date: 'Apr 20, 2024', hasHealthPlan: false },
  { id: 3, type: 'ECG', date: 'Apr 13, 2024', hasHealthPlan: true },
  { id: 4, type: 'MRI Scan', date: 'Apr 16, 2024', hasHealthPlan: false },
];

const mockAlerts = [
  { id: 1, message: 'Abnormal white blood cell count', severity: 'high' },
  { id: 2, message: 'Potential iron deficiency', severity: 'medium' },
  { id: 3, message: 'Elevated cholesterol levels', severity: 'medium' },
  { id: 4, message: 'Significant findings in MRI scan', severity: 'high' },
];

const mockRecommendations = [
  { id: 1, title: 'Increase iron intake', description: 'Add more leafy greens and red meat to your diet' },
  { id: 2, title: 'Monitor blood pressure', description: 'Check blood pressure twice daily and log results' },
  { id: 3, title: 'Reduce sodium intake', description: 'Limit processed foods and added salt in cooking' },
];

export default function Dashboard() {
  return (
    <DashboardLayout activePage="overview">

      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold">Dashboard</h1>
        <Link href="/dashboard/upload" className="inline-block">
          <Button variant="primary">
            <span className="mr-2">+</span> Upload
          </Button>
        </Link>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
        <Card className="flex items-center">
          <div className="h-12 w-12 rounded-lg bg-accent/10 flex items-center justify-center mr-4">
            <span className="text-accent text-xl">📄</span>
          </div>
          <div>
            <div className="text-3xl font-bold">168</div>
            <div className="text-gray-400">Reports</div>
          </div>
        </Card>
        
        <Card className="flex items-center">
          <div className="h-12 w-12 rounded-lg bg-warning/10 flex items-center justify-center mr-4">
            <span className="text-warning text-xl">⚠️</span>
          </div>
          <div>
            <div className="text-3xl font-bold">5</div>
            <div className="text-gray-400">Alerts</div>
          </div>
        </Card>
        
        <Link href="/dashboard/trends">
          <Card className="flex items-center cursor-pointer hover:bg-card-hover transition-colors">
            <div className="h-12 w-12 rounded-lg bg-success/10 flex items-center justify-center mr-4">
              <span className="text-success text-xl">📈</span>
            </div>
            <div>
              <div className="text-3xl font-bold">14%</div>
              <div className="text-gray-400">Trend</div>
            </div>
          </Card>
        </Link>
        
        <Link href="/dashboard/health-plans">
          <Card className="flex items-center cursor-pointer hover:bg-card-hover transition-colors">
            <div className="h-12 w-12 rounded-lg bg-accent/10 flex items-center justify-center mr-4">
              <span className="text-accent text-xl">🌱</span>
            </div>
            <div>
              <div className="text-3xl font-bold">2</div>
              <div className="text-gray-400">Health Plans</div>
            </div>
          </Card>
        </Link>
      </div>

      {/* Recent Reports, Health Alerts & Recommendations */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2">
          <Card>
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-bold">Recent Reports</h2>
              <Link href="/dashboard/trends" className="text-sm text-accent hover:underline flex items-center">
                <span>View Trends</span>
                <span className="ml-1">→</span>
              </Link>
            </div>
            <div className="space-y-4">
              {mockReports.map((report) => (
                <div key={report.id} className="flex justify-between items-center border-b border-gray-800 pb-4 last:border-0 last:pb-0">
                  <div>
                    <div className="font-medium">{report.type}</div>
                    <div className="text-sm text-gray-400">{report.date}</div>
                  </div>
                  <div className="flex items-center">
                    {report.hasHealthPlan && (
                      <div className="mr-3 px-2 py-1 rounded-full bg-accent/10 text-accent text-xs flex items-center">
                        <span className="mr-1">🌱</span>
                        <span>Health Plan</span>
                      </div>
                    )}
                    <Link href={`/dashboard/reports/${report.id}`} className="px-4 py-1 rounded-lg bg-accent/10 text-accent hover:bg-accent/20 transition-colors">
                      View
                    </Link>
                  </div>
                </div>
              ))}
            </div>
          </Card>
        </div>
        
        <div className="space-y-6">
          <Card>
            <h2 className="text-xl font-bold mb-4">Health Alerts</h2>
            <div className="space-y-3">
              {mockAlerts.map((alert) => (
                <div 
                  key={alert.id} 
                  className={`p-3 rounded-lg ${alert.severity === 'high' ? 'bg-danger/10 border-l-4 border-danger' : 'bg-warning/10 border-l-4 border-warning'}`}
                >
                  <div className="flex items-start">
                    <span className="mr-2">{alert.severity === 'high' ? '🔴' : '🟠'}</span>
                    <span>{alert.message}</span>
                  </div>
                </div>
              ))}
            </div>
          </Card>
          
          <Card>
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-bold">Personalized Recommendations</h2>
              <Link href="/dashboard/health-plans" className="text-sm text-accent hover:underline flex items-center">
                <span>View All</span>
                <span className="ml-1">→</span>
              </Link>
            </div>
            <div className="space-y-3">
              {mockRecommendations.map((rec) => (
                <div key={rec.id} className="p-3 rounded-lg bg-card-hover">
                  <div className="font-medium mb-1 flex items-center">
                    <span className="text-accent mr-2">•</span>
                    {rec.title}
                  </div>
                  <div className="text-sm text-gray-400 ml-5">{rec.description}</div>
                </div>
              ))}
            </div>
          </Card>
        </div>
      </div>
    </DashboardLayout>
  );
}