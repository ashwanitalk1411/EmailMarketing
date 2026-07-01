'use client';

import Link from 'next/link';
import { useParams } from 'next/navigation';
import DashboardLayout from '@/components/layout/DashboardLayout';

const tabs = [
  { id: 'dashboard', label: 'Dashboard', icon: '📊' },
  { id: 'contacts', label: 'Contacts', icon: '👥' },
  { id: 'templates', label: 'Templates', icon: '📝' },
  { id: 'logs', label: 'Email Logs', icon: '📋' },
];

interface UserViewNavProps {
  activeTab: string;
  userName: string;
  userEmail: string;
}

export default function UserViewNav({ activeTab, userName, userEmail }: UserViewNavProps) {
  const params = useParams();
  const userId = params.id;

  return (
    <div className="mb-6">
      <Link href="/users" className="text-sm text-accent hover:underline mb-3 inline-block">
        ← Back to Users
      </Link>
      <div className="card mb-4">
        <p className="text-xs text-muted uppercase tracking-wide mb-1">Viewing User</p>
        <h2 className="text-xl font-bold">{userName}</h2>
        <p className="text-sm text-muted">{userEmail}</p>
      </div>
      <nav className="flex flex-wrap gap-2">
        {tabs.map((tab) => (
          <Link
            key={tab.id}
            href={`/users/${userId}?tab=${tab.id}`}
            className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm transition-colors ${
              activeTab === tab.id
                ? 'bg-accent/10 text-accent font-medium'
                : 'bg-card border border-card-border text-muted hover:text-foreground'
            }`}
          >
            <span>{tab.icon}</span>
            {tab.label}
          </Link>
        ))}
      </nav>
    </div>
  );
}

export function UserViewWrapper({
  children,
  activeTab,
  userName,
  userEmail,
}: UserViewNavProps & { children: React.ReactNode }) {
  return (
    <DashboardLayout title="User Dashboard">
      <UserViewNav activeTab={activeTab} userName={userName} userEmail={userEmail} />
      {children}
    </DashboardLayout>
  );
}
