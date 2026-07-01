'use client';

import { useEffect, useState, useCallback } from 'react';
import { useSearchParams } from 'next/navigation';
import DashboardLayout from '@/components/layout/DashboardLayout';
import StatusBadge from '@/components/ui/StatusBadge';
import Pagination from '@/components/ui/Pagination';
import { Select } from '@/components/ui/Input';
import { api } from '@/lib/api';
import { EmailLog, Pagination as PaginationType, User } from '@/types';
import { useAuth } from '@/contexts/AuthContext';

function formatLogTime(log: EmailLog) {
  const date = log.sent_at || log.updated_at || log.created_at;
  return date ? new Date(date).toLocaleString() : '-';
}

export default function LogsPage() {
  const { user } = useAuth();
  const searchParams = useSearchParams();
  const isAdmin = user?.role === 'super_admin';

  const [logs, setLogs] = useState<EmailLog[]>([]);
  const [users, setUsers] = useState<User[]>([]);
  const [pagination, setPagination] = useState<PaginationType>({
    page: 1,
    limit: 20,
    total: 0,
    totalPages: 0,
  });
  const [status, setStatus] = useState('');
  const [filterUserId, setFilterUserId] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const userId = searchParams.get('user_id');
    if (userId) setFilterUserId(userId);
  }, [searchParams]);

  useEffect(() => {
    if (isAdmin) {
      api.get<{ users: User[] }>('/users?limit=100').then((res) => {
        if (res.success && res.data) setUsers(res.data.users);
      });
    }
  }, [isAdmin]);

  const fetchLogs = useCallback(async (page = 1) => {
    setLoading(true);
    const params = new URLSearchParams({ page: String(page), limit: '20' });
    if (status) params.set('status', status);
    if (isAdmin && filterUserId) params.set('user_id', filterUserId);

    const res = await api.get<{ logs: EmailLog[]; pagination: PaginationType }>(
      `/emails/logs?${params}`
    );
    if (res.success && res.data) {
      setLogs(res.data.logs);
      setPagination(res.data.pagination);
    }
    setLoading(false);
  }, [status, filterUserId, isAdmin]);

  useEffect(() => { fetchLogs(); }, [fetchLogs]);

  return (
    <DashboardLayout title={isAdmin ? 'All Email Logs' : 'Email Logs'}>
      <div className="flex flex-wrap gap-4 mb-4">
        <div className="max-w-xs flex-1">
          <Select
            label="Filter by Status"
            value={status}
            onChange={(e) => setStatus(e.target.value)}
            options={[
              { value: '', label: 'All Statuses' },
              { value: 'pending', label: 'Pending' },
              { value: 'sending', label: 'Sending' },
              { value: 'sent', label: 'Sent' },
              { value: 'failed', label: 'Failed' },
            ]}
          />
        </div>

        {isAdmin && (
          <div className="max-w-xs flex-1">
            <Select
              label="Filter by User"
              value={filterUserId}
              onChange={(e) => setFilterUserId(e.target.value)}
              options={[
                { value: '', label: 'All Users' },
                ...users.map((u) => ({
                  value: String(u.id),
                  label: `${u.name} (${u.email})`,
                })),
              ]}
            />
          </div>
        )}
      </div>

      {isAdmin && pagination.total > 0 && (
        <p className="text-sm text-muted mb-4">
          Showing {logs.length} of <strong>{pagination.total}</strong> total emails
          {filterUserId ? ' for selected user' : ' from all users'}
        </p>
      )}

      {loading ? (
        <div className="flex justify-center py-20">
          <div className="w-8 h-8 border-2 border-accent/30 border-t-accent rounded-full animate-spin" />
        </div>
      ) : (
        <>
          <div className="card overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-card-border text-muted">
                  {isAdmin && <th className="text-left py-3 px-2">User</th>}
                  <th className="text-left py-3 px-2">Recipient</th>
                  <th className="text-left py-3 px-2">Subject</th>
                  <th className="text-left py-3 px-2">Status</th>
                  <th className="text-left py-3 px-2">Date / Time</th>
                  <th className="text-left py-3 px-2 min-w-[220px]">Reason / Error</th>
                </tr>
              </thead>
              <tbody>
                {logs.map((log) => (
                  <tr key={log.id} className="border-b border-card-border/50">
                    {isAdmin && (
                      <td className="py-3 px-2">
                        <p className="font-medium">{log.user_name || '-'}</p>
                        <p className="text-xs text-muted">{log.user_email}</p>
                      </td>
                    )}
                    <td className="py-3 px-2">{log.recipient_email}</td>
                    <td className="py-3 px-2 max-w-[200px]">{log.subject}</td>
                    <td className="py-3 px-2"><StatusBadge status={log.status} /></td>
                    <td className="py-3 px-2 text-muted whitespace-nowrap">
                      {formatLogTime(log)}
                    </td>
                    <td className="py-3 px-2 text-danger text-xs break-words max-w-xs">
                      {log.error_message || (log.status === 'sent' ? '-' : '')}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
            {logs.length === 0 && (
              <p className="text-center text-muted py-8">No email logs found</p>
            )}
          </div>
          <Pagination
            page={pagination.page}
            totalPages={pagination.totalPages}
            onPageChange={fetchLogs}
          />
        </>
      )}
    </DashboardLayout>
  );
}
