'use client';

import { useEffect, useState, useCallback } from 'react';
import DashboardLayout from '@/components/layout/DashboardLayout';
import Button from '@/components/ui/Button';
import Modal from '@/components/ui/Modal';
import { Input } from '@/components/ui/Input';
import Pagination from '@/components/ui/Pagination';
import EmptyState from '@/components/ui/EmptyState';
import { api } from '@/lib/api';
import { Contact, ImportSummary, Pagination as PaginationType } from '@/types';

export default function ContactsPage() {
  const [contacts, setContacts] = useState<Contact[]>([]);
  const [pagination, setPagination] = useState<PaginationType>({
    page: 1,
    limit: 20,
    total: 0,
    totalPages: 0,
  });
  const [search, setSearch] = useState('');
  const [loading, setLoading] = useState(true);
  const [modalOpen, setModalOpen] = useState(false);
  const [importModalOpen, setImportModalOpen] = useState(false);
  const [editingContact, setEditingContact] = useState<Contact | null>(null);
  const [form, setForm] = useState({ name: '', email: '' });
  const [importSummary, setImportSummary] = useState<ImportSummary | null>(null);
  const [saving, setSaving] = useState(false);
  const [importing, setImporting] = useState(false);

  const fetchContacts = useCallback(async (page = 1) => {
    setLoading(true);
    const params = new URLSearchParams({ page: String(page), limit: '20' });
    if (search) params.set('search', search);
    const res = await api.get<{ contacts: Contact[]; pagination: PaginationType }>(
      `/contacts?${params}`
    );
    if (res.success && res.data) {
      setContacts(res.data.contacts);
      setPagination(res.data.pagination);
    }
    setLoading(false);
  }, [search]);

  useEffect(() => {
    const timer = setTimeout(() => fetchContacts(), 300);
    return () => clearTimeout(timer);
  }, [fetchContacts]);

  const openCreate = () => {
    setEditingContact(null);
    setForm({ name: '', email: '' });
    setModalOpen(true);
  };

  const openEdit = (contact: Contact) => {
    setEditingContact(contact);
    setForm({ name: contact.name, email: contact.email });
    setModalOpen(true);
  };

  const handleSave = async () => {
    setSaving(true);
    const res = editingContact
      ? await api.put(`/contacts/${editingContact.id}`, form)
      : await api.post('/contacts', form);

    if (res.success) {
      setModalOpen(false);
      fetchContacts(pagination.page);
    } else {
      alert(res.message);
    }
    setSaving(false);
  };

  const handleDelete = async (id: number) => {
    if (!confirm('Delete this contact?')) return;
    const res = await api.delete(`/contacts/${id}`);
    if (res.success) fetchContacts(pagination.page);
  };

  const handleImport = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setImporting(true);
    const formData = new FormData();
    formData.append('file', file);
    const res = await api.post<ImportSummary>('/contacts/import', formData);
    if (res.success && res.data) {
      setImportSummary(res.data);
      fetchContacts();
    } else {
      alert(res.message);
    }
    setImporting(false);
    e.target.value = '';
  };

  return (
    <DashboardLayout
      title="Contacts"
      action={
        <div className="flex gap-2">
          <Button variant="secondary" onClick={() => { setImportSummary(null); setImportModalOpen(true); }}>
            Import CSV
          </Button>
          <Button onClick={openCreate}>Add Contact</Button>
        </div>
      }
    >
      <div className="mb-4">
        <Input
          placeholder="Search contacts..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="max-w-sm"
        />
      </div>

      {loading ? (
        <div className="flex justify-center py-20">
          <div className="w-8 h-8 border-2 border-accent/30 border-t-accent rounded-full animate-spin" />
        </div>
      ) : contacts.length === 0 ? (
        <EmptyState
          title="No contacts found"
          description="Add contacts manually or import from CSV"
          action={<Button onClick={openCreate}>Add Contact</Button>}
        />
      ) : (
        <>
          <div className="card overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-card-border text-muted">
                  <th className="text-left py-3 px-2">Name</th>
                  <th className="text-left py-3 px-2">Email</th>
                  <th className="text-left py-3 px-2">Added</th>
                  <th className="text-right py-3 px-2">Actions</th>
                </tr>
              </thead>
              <tbody>
                {contacts.map((contact) => (
                  <tr key={contact.id} className="border-b border-card-border/50">
                    <td className="py-3 px-2">{contact.name}</td>
                    <td className="py-3 px-2">{contact.email}</td>
                    <td className="py-3 px-2 text-muted">
                      {new Date(contact.created_at).toLocaleDateString()}
                    </td>
                    <td className="py-3 px-2 text-right space-x-2">
                      <button onClick={() => openEdit(contact)} className="text-accent hover:underline text-sm">
                        Edit
                      </button>
                      <button onClick={() => handleDelete(contact.id)} className="text-danger hover:underline text-sm">
                        Delete
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <Pagination
            page={pagination.page}
            totalPages={pagination.totalPages}
            onPageChange={fetchContacts}
          />
        </>
      )}

      <Modal isOpen={modalOpen} onClose={() => setModalOpen(false)} title={editingContact ? 'Edit Contact' : 'Add Contact'}>
        <div className="space-y-4">
          <Input label="Name" value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} required />
          <Input label="Email" type="email" value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} required />
          <div className="flex justify-end gap-2">
            <Button variant="secondary" onClick={() => setModalOpen(false)}>Cancel</Button>
            <Button onClick={handleSave} loading={saving}>Save</Button>
          </div>
        </div>
      </Modal>

      <Modal isOpen={importModalOpen} onClose={() => setImportModalOpen(false)} title="Import Contacts">
        <div className="space-y-4">
          <p className="text-sm text-muted">
            Upload a CSV file with columns: name, email. Duplicate emails will be skipped automatically.
          </p>
          <input
            type="file"
            accept=".csv"
            onChange={handleImport}
            disabled={importing}
            className="block w-full text-sm text-muted file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:bg-accent file:text-white file:cursor-pointer"
          />
          {importing && <p className="text-sm text-accent">Importing...</p>}
          {importSummary && (
            <div className="bg-background rounded-lg p-4 space-y-1 text-sm">
              <p>Total Records: <strong>{importSummary.total}</strong></p>
              <p className="text-success">Saved: <strong>{importSummary.saved}</strong></p>
              <p className="text-warning">Skipped: <strong>{importSummary.skipped}</strong></p>
              <p className="text-danger">Invalid: <strong>{importSummary.invalid}</strong></p>
            </div>
          )}
        </div>
      </Modal>
    </DashboardLayout>
  );
}
