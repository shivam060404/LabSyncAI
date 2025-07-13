import Link from 'next/link';

type SidebarProps = {
  activePage: 'overview' | 'reports' | 'upload' | 'profile' | 'trends' | 'health-plans' | 'recommendations' | 'low-resource';
};

export default function Sidebar({ activePage }: SidebarProps) {
  return (
    <aside className="w-64 border-r border-gray-800 h-[calc(100vh-73px)] p-4 hidden md:block">
      <div className="space-y-1">
        <Link 
          href="/dashboard" 
          className={`block px-4 py-2 rounded-lg ${activePage === 'overview' ? 'bg-accent/10 text-accent' : 'hover:bg-card-hover transition-colors'}`}
        >
          Overview
        </Link>
        <Link 
          href="/dashboard/reports" 
          className={`block px-4 py-2 rounded-lg ${activePage === 'reports' ? 'bg-accent/10 text-accent' : 'hover:bg-card-hover transition-colors'}`}
        >
          Reports
        </Link>
        <Link 
          href="/dashboard/health-plans" 
          className={`block px-4 py-2 rounded-lg ${activePage === 'health-plans' ? 'bg-accent/10 text-accent' : 'hover:bg-card-hover transition-colors'}`}
        >
          Health Plans
        </Link>
        <Link 
          href="/dashboard/recommendations" 
          className={`block px-4 py-2 rounded-lg ${activePage === 'recommendations' ? 'bg-accent/10 text-accent' : 'hover:bg-card-hover transition-colors'}`}
        >
          Recommendations
        </Link>
        <Link 
          href="/dashboard/upload" 
          className={`block px-4 py-2 rounded-lg ${activePage === 'upload' ? 'bg-accent/10 text-accent' : 'hover:bg-card-hover transition-colors'}`}
        >
          Upload
        </Link>
        <Link 
          href="/dashboard/trends" 
          className={`block px-4 py-2 rounded-lg ${activePage === 'trends' ? 'bg-accent/10 text-accent' : 'hover:bg-card-hover transition-colors'}`}
        >
          Trends
        </Link>
        <Link 
          href="/dashboard/profile" 
          className={`block px-4 py-2 rounded-lg ${activePage === 'profile' ? 'bg-accent/10 text-accent' : 'hover:bg-card-hover transition-colors'}`}
        >
          Profile
        </Link>
        <Link 
          href="/dashboard/low-resource" 
          className={`block px-4 py-2 rounded-lg ${activePage === 'low-resource' ? 'bg-accent/10 text-accent' : 'hover:bg-card-hover transition-colors'}`}
        >
          Low Resource Demo
        </Link>
      </div>
    </aside>
  );
}