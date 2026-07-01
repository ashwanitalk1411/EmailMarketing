'use client';

import { useEffect, useState } from 'react';
import DashboardLayout from '@/components/layout/DashboardLayout';
import Button from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { api } from '@/lib/api';
import { Contact, Template } from '@/types';

export default function SendEmailPage() {
  const [contacts, setContacts] = useState<Contact[]>([]);
  const [templates, setTemplates] = useState<Template[]>([]);
  const [selectedContacts, setSelectedContacts] = useState<number[]>([]);
  const [templateId, setTemplateId] = useState<number | ''>('');
  const [subject, setSubject] = useState('');
  const [loading, setLoading] = useState(true);
  const [sending, setSending] = useState(false);
  const [result, setResult] = useState<{ sent: number; failed: number; total: number } | null>(null);
  const [search, setSearch] = useState('');

  useEffect(() => {
    Promise.all([
      api.get<{ contacts: Contact[] }>('/contacts?limit=1000'),
      api.get<Template[]>('/templates'),
    ]).then(([contactsRes, templatesRes]) => {
      if (contactsRes.success && contactsRes.data) setContacts(contactsRes.data.contacts);
      if (templatesRes.success && templatesRes.data) setTemplates(templatesRes.data);
      setLoading(false);
    });
  }, []);

  const toggleContact = (id: number) => {
    setSelectedContacts((prev) =>
      prev.includes(id) ? prev.filter((c) => c !== id) : [...prev, id]
    );
  };

  const toggleAll = () => {
    const filtered = filteredContacts.map((c) => c.id);
    if (selectedContacts.length === filtered.length) {
      setSelectedContacts([]);
    } else {
      setSelectedContacts(filtered);
    }
  };

  const handleSend = async () => {
    if (!templateId || selectedContacts.length === 0) {
      alert('Please select contacts and a template');
      return;
    }

    setSending(true);
    setResult(null);
    const res = await api.post<{ sent: number; failed: number; total: number }>('/emails/send', {
      contact_ids: selectedContacts,
      template_id: templateId,
      subject: subject || undefined,
    });

    if (res.success && res.data) {
      setResult(res.data);
      setSelectedContacts([]);
    } else {
      alert(res.message);
    }
    setSending(false);
  };

  const filteredContacts = contacts.filter(
    (c) =>
      c.name.toLowerCase().includes(search.toLowerCase()) ||
      c.email.toLowerCase().includes(search.toLowerCase())
  );

  if (loading) {
    return (
      <DashboardLayout title="Send Email">
        <div className="flex justify-center py-20">
          <div className="w-8 h-8 border-2 border-accent/30 border-t-accent rounded-full animate-spin" />
        </div>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout title="Send Email">
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 card">
          <div className="flex items-center justify-between mb-4">
            <h2 className="font-semibold">Select Contacts ({selectedContacts.length} selected)</h2>
            <button onClick={toggleAll} className="text-sm text-accent hover:underline">
              {selectedContacts.length === filteredContacts.length ? 'Deselect All' : 'Select All'}
            </button>
          </div>
          <Input
            placeholder="Search contacts..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="mb-4"
          />
          <div className="max-h-[400px] overflow-y-auto space-y-1">
            {filteredContacts.map((contact) => (
              <label
                key={contact.id}
                className="flex items-center gap-3 p-2 rounded-lg hover:bg-background cursor-pointer"
              >
                <input
                  type="checkbox"
                  checked={selectedContacts.includes(contact.id)}
                  onChange={() => toggleContact(contact.id)}
                  className="accent-accent w-4 h-4"
                />
                <div>
                  <p className="text-sm font-medium">{contact.name}</p>
                  <p className="text-xs text-muted">{contact.email}</p>
                </div>
              </label>
            ))}
          </div>
        </div>

        <div className="card space-y-4">
          <h2 className="font-semibold">Email Details</h2>

          <div className="space-y-1">
            <label className="block text-sm font-medium text-muted">Template</label>
            <select
              className="input-field"
              value={templateId}
              onChange={(e) => {
                const id = Number(e.target.value);
                setTemplateId(id || '');
                const tmpl = templates.find((t) => t.id === id);
                if (tmpl && !subject) setSubject(tmpl.subject);
              }}
            >
              <option value="">Choose a template</option>
              {templates.map((t) => (
                <option key={t.id} value={t.id}>{t.name}</option>
              ))}
            </select>
          </div>

          <Input
            label="Subject (optional override)"
            value={subject}
            onChange={(e) => setSubject(e.target.value)}
            placeholder="Uses template subject if empty"
          />

          <Button
            onClick={handleSend}
            loading={sending}
            disabled={!templateId || selectedContacts.length === 0}
            className="w-full"
          >
            Send to {selectedContacts.length} contact{selectedContacts.length !== 1 ? 's' : ''}
          </Button>

          {result && (
            <div className="bg-background rounded-lg p-4 text-sm space-y-1">
              <p>Total: <strong>{result.total}</strong></p>
              <p className="text-success">Sent: <strong>{result.sent}</strong></p>
              <p className="text-danger">Failed: <strong>{result.failed}</strong></p>
            </div>
          )}
        </div>
      </div>
    </DashboardLayout>
  );
}
