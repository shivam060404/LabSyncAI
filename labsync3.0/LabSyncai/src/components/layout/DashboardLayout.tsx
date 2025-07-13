import React from 'react';
import Navbar from './Navbar';
import Sidebar from './Sidebar';

type DashboardLayoutProps = {
  children: React.ReactNode;
  activePage: 'overview' | 'reports' | 'upload' | 'profile' | 'trends' | 'health-plans' | 'recommendations';
  userName?: string;
  notificationCount?: number;
};

export default function DashboardLayout({
  children,
  activePage,
  userName = 'JS',
  notificationCount = 5
}: DashboardLayoutProps) {
  return (
    <div className="min-h-screen bg-background">
      <Navbar userName={userName} notificationCount={notificationCount} />
      
      <div className="flex">
        <Sidebar activePage={activePage} />
        
        <main className="flex-1 p-6 overflow-y-auto">
          {children}
        </main>
      </div>
    </div>
  );
}