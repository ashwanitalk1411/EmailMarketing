'use client';

import { useEffect, useState } from 'react';
import DashboardLayout from '@/components/layout/DashboardLayout';
import StatCard from '@/components/ui/StatCard';
import StatusBadge from '@/components/ui/StatusBadge';
import { api } from '@/lib/api';
import { DashboardStats, EmailLog } from '@/types';
import { useAuth } from '@/contexts/AuthContext';
import Link from 'next/link';

function formatLogTime(log: EmailLog) {
  const date = log.sent_at || log.updated_at || log.created_at;
  return date ? new Date(date).toLocaleString() : '-';
}

export default function DashboardPage() {
  const { user } = useAuth();
  const isAdmin = user?.role === 'super_admin';
  const [stats, setStats] = useState<DashboardStats | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api.get<DashboardStats>('/dashboard/stats').then((res) => {
      if (res.success && res.data) setStats(res.data);
      setLoading(false);
    });
  }, []);

  if (loading) {
    return (
      <DashboardLayout title="Dashboard">
        <div className="flex justify-center py-20">
          <div className="w-8 h-8 border-2 border-accent/30 border-t-accent rounded-full animate-spin" />
        </div>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout title="Dashboard">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <StatCard
          title="Total Contacts"
          value={stats?.total_contacts ?? 0}
          icon={<span className="text-xl">👥</span>}
        />
        <StatCard
          title="Emails Sent"
          value={stats?.emails_sent ?? 0}
          icon={<span className="text-xl">✉️</span>}
          color="text-success"
        />
        <StatCard
          title="Pending Emails"
          value={stats?.pending_emails ?? 0}
          icon={<span className="text-xl">⏳</span>}
          color="text-warning"
        />
        <StatCard
          title="Failed Emails"
          value={stats?.failed_emails ?? 0}
          icon={<span className="text-xl">❌</span>}
          color="text-danger"
        />
      </div>

      <div className="card">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-semibold">
            {isAdmin ? 'Recent Emails (All Users)' : 'Recent Email Logs'}
          </h2>
          {isAdmin && (
            <Link href="/logs" className="text-sm text-accent hover:underline">
              View all emails →
            </Link>
          )}
        </div>
        {stats?.recent_logs && stats.recent_logs.length > 0 ? (
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-card-border text-muted">
                  {isAdmin && <th className="text-left py-3 px-2">User</th>}
                  <th className="text-left py-3 px-2">Recipient</th>
                  <th className="text-left py-3 px-2">Subject</th>
                  <th className="text-left py-3 px-2">Status</th>
                  <th className="text-left py-3 px-2">Date / Time</th>
                </tr>
              </thead>
              <tbody>
                {stats.recent_logs.map((log) => (
                  <tr key={log.id} className="border-b border-card-border/50">
                    {isAdmin && (
                      <td className="py-3 px-2 text-muted text-xs">
                        {log.user_name || log.user_email || '-'}
                      </td>
                    )}
                    <td className="py-3 px-2">{log.recipient_email}</td>
                    <td className="py-3 px-2 truncate max-w-[200px]">{log.subject}</td>
                    <td className="py-3 px-2">
                      <StatusBadge status={log.status} />
                    </td>
                    <td className="py-3 px-2 text-muted">
                      {formatLogTime(log)}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <p className="text-muted text-center py-8">No email logs yet</p>
        )}
      </div>
    </DashboardLayout>
  );
}
