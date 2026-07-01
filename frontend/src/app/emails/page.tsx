'use client';

import { useEffect, useState, useCallback } from 'react';
import { useSearchParams } from 'next/navigation';
import DashboardLayout from '@/components/layout/DashboardLayout';
import { Input, Select } from '@/components/ui/Input';
import Pagination from '@/components/ui/Pagination';
import EmptyState from '@/components/ui/EmptyState';
import { api } from '@/lib/api';
import { Contact, Pagination as PaginationType, User } from '@/types';

export default function AllEmailsPage() {
  const searchParams = useSearchParams();
  const [contacts, setContacts] = useState<Contact[]>([]);
  const [users, setUsers] = useState<User[]>([]);
  const [pagination, setPagination] = useState<PaginationType>({
    page: 1,
    limit: 20,
    total: 0,
    totalPages: 0,
  });
  const [search, setSearch] = useState('');
  const [filterUserId, setFilterUserId] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const userId = searchParams.get('user_id');
    if (userId) setFilterUserId(userId);
  }, [searchParams]);

  useEffect(() => {
    api.get<{ users: User[] }>('/users?limit=100').then((res) => {
      if (res.success && res.data) setUsers(res.data.users);
    });
  }, []);

  const fetchEmails = useCallback(async (page = 1) => {
    setLoading(true);
    const params = new URLSearchParams({ page: String(page), limit: '20' });
    if (search) params.set('search', search);
    if (filterUserId) params.set('user_id', filterUserId);

    const res = await api.get<{ contacts: Contact[]; pagination: PaginationType }>(
      `/contacts/all?${params}`
    );
    if (res.success && res.data) {
      setContacts(res.data.contacts);
      setPagination(res.data.pagination);
    }
    setLoading(false);
  }, [search, filterUserId]);

  useEffect(() => {
    const timer = setTimeout(() => fetchEmails(), 300);
    return () => clearTimeout(timer);
  }, [fetchEmails]);

  return (
    <DashboardLayout title="All Emails">
      <div className="flex flex-wrap gap-4 mb-4">
        <div className="flex-1 min-w-[200px] max-w-sm">
          <Input
            label="Search"
            placeholder="Search by name or email..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>
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
      </div>

      {pagination.total > 0 && (
        <p className="text-sm text-muted mb-4">
          Total: <strong>{pagination.total}</strong> contact emails
          {filterUserId ? ' for selected user' : ' from all users'}
        </p>
      )}

      {loading ? (
        <div className="flex justify-center py-20">
          <div className="w-8 h-8 border-2 border-accent/30 border-t-accent rounded-full animate-spin" />
        </div>
      ) : contacts.length === 0 ? (
        <EmptyState title="No emails found" description="No contact emails in the system yet" />
      ) : (
        <>
          <div className="card overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-card-border text-muted">
                  <th className="text-left py-3 px-2">#</th>
                  <th className="text-left py-3 px-2">Name</th>
                  <th className="text-left py-3 px-2">Email</th>
                  <th className="text-left py-3 px-2">Owner (User)</th>
                  <th className="text-left py-3 px-2">Added</th>
                </tr>
              </thead>
              <tbody>
                {contacts.map((contact, index) => (
                  <tr key={contact.id} className="border-b border-card-border/50">
                    <td className="py-3 px-2 text-muted">
                      {(pagination.page - 1) * pagination.limit + index + 1}
                    </td>
                    <td className="py-3 px-2 font-medium">{contact.name}</td>
                    <td className="py-3 px-2 text-accent">{contact.email}</td>
                    <td className="py-3 px-2">
                      <p className="font-medium">{contact.user_name || '-'}</p>
                      <p className="text-xs text-muted">{contact.user_email}</p>
                    </td>
                    <td className="py-3 px-2 text-muted whitespace-nowrap">
                      {new Date(contact.created_at).toLocaleDateString()}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <Pagination
            page={pagination.page}
            totalPages={pagination.totalPages}
            onPageChange={fetchEmails}
          />
        </>
      )}
    </DashboardLayout>
  );
}
