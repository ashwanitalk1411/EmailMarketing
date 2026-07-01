'use client';

import { ReactNode } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import Sidebar from './Sidebar';

interface DashboardLayoutProps {
  children: ReactNode;
  title: string;
  action?: ReactNode;
}

export default function DashboardLayout({ children, title, action }: DashboardLayoutProps) {
  const { loading } = useAuth();

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <div className="w-8 h-8 border-2 border-accent/30 border-t-accent rounded-full animate-spin" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <Sidebar />
      <main className="ml-64 p-8">
        <div className="flex items-center justify-between mb-8">
          <h1 className="text-2xl font-bold">{title}</h1>
          {action}
        </div>
        {children}
      </main>
    </div>
  );
}
