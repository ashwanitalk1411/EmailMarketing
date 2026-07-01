'use client';

import { useEffect, useState, useCallback, Suspense } from 'react';
import { useParams, useSearchParams } from 'next/navigation';
import { UserViewWrapper } from '@/components/layout/UserViewNav';
import StatCard from '@/components/ui/StatCard';
import StatusBadge from '@/components/ui/StatusBadge';
import Pagination from '@/components/ui/Pagination';
import EmptyState from '@/components/ui/EmptyState';
import Modal from '@/components/ui/Modal';
import { api } from '@/lib/api';
import { UserDetail, Contact, Template, EmailLog, Pagination as PaginationType } from '@/types';

function formatLogTime(log: EmailLog) {
  const date = log.sent_at || log.updated_at || log.created_at;
  return date ? new Date(date).toLocaleString() : '-';
}

function UserDashboardContent() {
  const params = useParams();
  const searchParams = useSearchParams();
  const userId = params.id as string;
  const activeTab = searchParams.get('tab') || 'dashboard';

  const [userData, setUserData] = useState<UserDetail | null>(null);
  const [contacts, setContacts] = useState<Contact[]>([]);
  const [templates, setTemplates] = useState<Template[]>([]);
  const [logs, setLogs] = useState<EmailLog[]>([]);
  const [pagination, setPagination] = useState<PaginationType>({
    page: 1, limit: 20, total: 0, totalPages: 0,
  });
  const [loading, setLoading] = useState(true);
  const [previewTemplate, setPreviewTemplate] = useState<Template | null>(null);

  const fetchUser = useCallback(async () => {
    const res = await api.get<UserDetail>(`/users/${userId}`);
    if (res.success && res.data) setUserData(res.data);
  }, [userId]);

  const fetchContacts = useCallback(async (page = 1) => {
    setLoading(true);
    const res = await api.get<{ contacts: Contact[]; pagination: PaginationType }>(
      `/contacts/all?user_id=${userId}&page=${page}&limit=20`
    );
    if (res.success && res.data) {
      setContacts(res.data.contacts);
      setPagination(res.data.pagination);
    }
    setLoading(false);
  }, [userId]);

  const fetchTemplates = useCallback(async () => {
    setLoading(true);
    const res = await api.get<Template[]>(`/templates/all?user_id=${userId}`);
    if (res.success && res.data) setTemplates(res.data);
    setLoading(false);
  }, [userId]);

  const fetchLogs = useCallback(async (page = 1) => {
    setLoading(true);
    const res = await api.get<{ logs: EmailLog[]; pagination: PaginationType }>(
      `/emails/logs?user_id=${userId}&page=${page}&limit=20`
    );
    if (res.success && res.data) {
      setLogs(res.data.logs);
      setPagination(res.data.pagination);
    }
    setLoading(false);
  }, [userId]);

  useEffect(() => {
    fetchUser();
  }, [fetchUser]);

  useEffect(() => {
    if (activeTab === 'contacts') fetchContacts();
    else if (activeTab === 'templates') fetchTemplates();
    else if (activeTab === 'logs') fetchLogs();
    else setLoading(false);
  }, [activeTab, fetchContacts, fetchTemplates, fetchLogs]);

  if (!userData) {
    return (
      <div className="flex justify-center py-20">
        <div className="w-8 h-8 border-2 border-accent/30 border-t-accent rounded-full animate-spin" />
      </div>
    );
  }

  return (
    <UserViewWrapper activeTab={activeTab} userName={userData.name} userEmail={userData.email}>
      {activeTab === 'dashboard' && (
        <>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4 mb-8">
            <StatCard title="Contacts" value={userData.stats?.total_contacts ?? 0} icon={<span>👥</span>} />
            <StatCard title="Templates" value={userData.stats?.total_templates ?? 0} icon={<span>📝</span>} />
            <StatCard title="Emails Sent" value={userData.stats?.emails_sent ?? 0} icon={<span>✉️</span>} color="text-success" />
            <StatCard title="Pending" value={userData.stats?.pending_emails ?? 0} icon={<span>⏳</span>} color="text-warning" />
            <StatCard title="Failed" value={userData.stats?.failed_emails ?? 0} icon={<span>❌</span>} color="text-danger" />
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <div className="card">
              <h3 className="font-semibold mb-4">Recent Contacts</h3>
              {userData.contacts && userData.contacts.length > 0 ? (
                <table className="w-full text-sm">
                  <thead>
                    <tr className="border-b border-card-border text-muted">
                      <th className="text-left py-2">Name</th>
                      <th className="text-left py-2">Email</th>
                    </tr>
                  </thead>
                  <tbody>
                    {userData.contacts.map((c) => (
                      <tr key={c.id} className="border-b border-card-border/50">
                        <td className="py-2">{c.name}</td>
                        <td className="py-2 text-muted">{c.email}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              ) : (
                <p className="text-muted text-center py-6">No contacts</p>
              )}
            </div>

            <div className="card">
              <h3 className="font-semibold mb-4">Recent Email Logs</h3>
              {userData.recent_logs && userData.recent_logs.length > 0 ? (
                <table className="w-full text-sm">
                  <thead>
                    <tr className="border-b border-card-border text-muted">
                      <th className="text-left py-2">Recipient</th>
                      <th className="text-left py-2">Status</th>
                      <th className="text-left py-2">Date</th>
                    </tr>
                  </thead>
                  <tbody>
                    {userData.recent_logs.map((log) => (
                      <tr key={log.id} className="border-b border-card-border/50">
                        <td className="py-2 truncate max-w-[140px]">{log.recipient_email}</td>
                        <td className="py-2"><StatusBadge status={log.status} /></td>
                        <td className="py-2 text-muted text-xs">{formatLogTime(log)}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              ) : (
                <p className="text-muted text-center py-6">No email logs</p>
              )}
            </div>
          </div>
        </>
      )}

      {activeTab === 'contacts' && (
        loading ? (
          <div className="flex justify-center py-20">
            <div className="w-8 h-8 border-2 border-accent/30 border-t-accent rounded-full animate-spin" />
          </div>
        ) : contacts.length === 0 ? (
          <EmptyState title="No contacts" description="This user has no contacts yet" />
        ) : (
          <>
            <div className="card overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-card-border text-muted">
                    <th className="text-left py-3 px-2">Name</th>
                    <th className="text-left py-3 px-2">Email</th>
                    <th className="text-left py-3 px-2">Added</th>
                  </tr>
                </thead>
                <tbody>
                  {contacts.map((c) => (
                    <tr key={c.id} className="border-b border-card-border/50">
                      <td className="py-3 px-2">{c.name}</td>
                      <td className="py-3 px-2 text-accent">{c.email}</td>
                      <td className="py-3 px-2 text-muted">
                        {new Date(c.created_at).toLocaleDateString()}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            <Pagination page={pagination.page} totalPages={pagination.totalPages} onPageChange={fetchContacts} />
          </>
        )
      )}

      {activeTab === 'templates' && (
        loading ? (
          <div className="flex justify-center py-20">
            <div className="w-8 h-8 border-2 border-accent/30 border-t-accent rounded-full animate-spin" />
          </div>
        ) : templates.length === 0 ? (
          <EmptyState title="No templates" description="This user has no templates yet" />
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {templates.map((t) => (
              <div key={t.id} className="card">
                <h3 className="font-semibold truncate">{t.name}</h3>
                <p className="text-sm text-muted mt-1 truncate">{t.subject}</p>
                <p className="text-xs text-muted mt-2">
                  {new Date(t.updated_at).toLocaleDateString()}
                </p>
                <button
                  onClick={() => setPreviewTemplate(t)}
                  className="text-sm text-accent hover:underline mt-3"
                >
                  Preview
                </button>
              </div>
            ))}
          </div>
        )
      )}

      {activeTab === 'logs' && (
        loading ? (
          <div className="flex justify-center py-20">
            <div className="w-8 h-8 border-2 border-accent/30 border-t-accent rounded-full animate-spin" />
          </div>
        ) : logs.length === 0 ? (
          <EmptyState title="No email logs" description="This user has no email logs yet" />
        ) : (
          <>
            <div className="card overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-card-border text-muted">
                    <th className="text-left py-3 px-2">Recipient</th>
                    <th className="text-left py-3 px-2">Subject</th>
                    <th className="text-left py-3 px-2">Status</th>
                    <th className="text-left py-3 px-2">Date / Time</th>
                    <th className="text-left py-3 px-2">Error</th>
                  </tr>
                </thead>
                <tbody>
                  {logs.map((log) => (
                    <tr key={log.id} className="border-b border-card-border/50">
                      <td className="py-3 px-2">{log.recipient_email}</td>
                      <td className="py-3 px-2 max-w-[180px]">{log.subject}</td>
                      <td className="py-3 px-2"><StatusBadge status={log.status} /></td>
                      <td className="py-3 px-2 text-muted whitespace-nowrap">{formatLogTime(log)}</td>
                      <td className="py-3 px-2 text-danger text-xs break-words max-w-xs">
                        {log.error_message || '-'}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            <Pagination page={pagination.page} totalPages={pagination.totalPages} onPageChange={fetchLogs} />
          </>
        )
      )}

      <Modal isOpen={!!previewTemplate} onClose={() => setPreviewTemplate(null)} title="Template Preview" size="xl">
        {previewTemplate && (
          <div>
            <p className="text-sm text-muted mb-2">Subject: {previewTemplate.subject}</p>
            <div
              className="bg-white text-black rounded-lg p-4 min-h-[200px]"
              dangerouslySetInnerHTML={{ __html: previewTemplate.html_content }}
            />
          </div>
        )}
      </Modal>
    </UserViewWrapper>
  );
}

export default function UserDashboardPage() {
  return (
    <Suspense fallback={
      <div className="flex justify-center py-20">
        <div className="w-8 h-8 border-2 border-accent/30 border-t-accent rounded-full animate-spin" />
      </div>
    }>
      <UserDashboardContent />
    </Suspense>
  );
}
