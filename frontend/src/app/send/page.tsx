'use client';

import { useEffect, useState, useRef } from 'react';
import DashboardLayout from '@/components/layout/DashboardLayout';
import Button from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { api } from '@/lib/api';
import { Contact, Template } from '@/types';

interface SavedResume {
  filename: string;
  has_resume: boolean;
}

export default function SendEmailPage() {
  const [contacts, setContacts] = useState<Contact[]>([]);
  const [templates, setTemplates] = useState<Template[]>([]);
  const [selectedContacts, setSelectedContacts] = useState<number[]>([]);
  const [templateId, setTemplateId] = useState<number | ''>('');
  const [subject, setSubject] = useState('');
  const [savedResume, setSavedResume] = useState<SavedResume | null>(null);
  const [attachResume, setAttachResume] = useState(false);
  const [pendingFile, setPendingFile] = useState<File | null>(null);
  const [loading, setLoading] = useState(true);
  const [savingResume, setSavingResume] = useState(false);
  const [sending, setSending] = useState(false);
  const [result, setResult] = useState<{ sent: number; failed: number; total: number } | null>(null);
  const [search, setSearch] = useState('');
  const fileInputRef = useRef<HTMLInputElement>(null);

  const loadSavedResume = async () => {
    const res = await api.get<SavedResume | null>('/auth/resume');
    if (res.success && res.data?.has_resume) {
      setSavedResume(res.data);
      setAttachResume(true);
    } else {
      setSavedResume(null);
      setAttachResume(false);
    }
  };

  useEffect(() => {
    Promise.all([
      api.get<{ contacts: Contact[] }>('/contacts?limit=1000'),
      api.get<Template[]>('/templates'),
      loadSavedResume(),
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

  const validateFile = (file: File) => {
    const ext = file.name.split('.').pop()?.toLowerCase();
    if (!['pdf', 'doc', 'docx'].includes(ext || '')) {
      alert('Only PDF, DOC, and DOCX files are allowed');
      return false;
    }
    if (file.size > 10 * 1024 * 1024) {
      alert('Resume file must be under 10MB');
      return false;
    }
    return true;
  };

  const handleFilePick = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file || !validateFile(file)) {
      e.target.value = '';
      return;
    }
    setPendingFile(file);
  };

  const handleSaveResume = async () => {
    if (!pendingFile) {
      alert('Please choose a resume file first');
      return;
    }

    setSavingResume(true);
    const formData = new FormData();
    formData.append('resume', pendingFile);

    const res = await api.post<SavedResume>('/auth/resume', formData);
    if (res.success && res.data) {
      setSavedResume(res.data);
      setAttachResume(true);
      setPendingFile(null);
      if (fileInputRef.current) fileInputRef.current.value = '';
    } else {
      alert(res.message);
    }
    setSavingResume(false);
  };

  const handleDeleteResume = async () => {
    if (!confirm('Remove saved resume?')) return;
    const res = await api.delete('/auth/resume');
    if (res.success) {
      setSavedResume(null);
      setAttachResume(false);
      setPendingFile(null);
      if (fileInputRef.current) fileInputRef.current.value = '';
    }
  };

  const handleSend = async () => {
    if (!templateId || selectedContacts.length === 0) {
      alert('Please select contacts and a template');
      return;
    }

    if (attachResume && !savedResume?.has_resume) {
      alert('Please save a resume first or uncheck "Attach resume"');
      return;
    }

    setSending(true);
    setResult(null);

    const formData = new FormData();
    formData.append('contact_ids', JSON.stringify(selectedContacts));
    formData.append('template_id', String(templateId));
    if (subject.trim()) formData.append('subject', subject.trim());
    formData.append('attach_resume', String(attachResume));

    const res = await api.post<{ sent: number; failed: number; total: number }>(
      '/emails/send',
      formData
    );

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

          <div className="border-t border-card-border pt-4 space-y-3">
            <h3 className="text-sm font-medium">My Resume</h3>
            <p className="text-xs text-muted">Upload once — it stays saved. No need to upload every time you send.</p>

            {savedResume?.has_resume && (
              <div className="flex items-center justify-between bg-background rounded-lg px-3 py-2 text-sm">
                <span className="truncate text-accent">📎 {savedResume.filename}</span>
                <button
                  type="button"
                  onClick={handleDeleteResume}
                  className="text-danger hover:underline text-xs ml-2 shrink-0"
                >
                  Remove
                </button>
              </div>
            )}

            <input
              ref={fileInputRef}
              type="file"
              accept=".pdf,.doc,.docx"
              onChange={handleFilePick}
              className="block w-full text-sm text-muted file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:bg-accent file:text-white file:cursor-pointer file:text-sm"
            />
            {pendingFile && (
              <p className="text-xs text-muted">Selected: {pendingFile.name}</p>
            )}
            <Button
              variant="secondary"
              onClick={handleSaveResume}
              loading={savingResume}
              className="w-full"
            >
              {savedResume?.has_resume ? 'Replace Saved Resume' : 'Save Resume'}
            </Button>

            <label className="flex items-center gap-2 text-sm cursor-pointer">
              <input
                type="checkbox"
                checked={attachResume}
                onChange={(e) => setAttachResume(e.target.checked)}
                disabled={!savedResume?.has_resume}
                className="accent-accent w-4 h-4"
              />
              Attach resume when sending
            </label>
          </div>

          <Button
            onClick={handleSend}
            loading={sending}
            disabled={!templateId || selectedContacts.length === 0}
            className="w-full"
          >
            Send to {selectedContacts.length} contact{selectedContacts.length !== 1 ? 's' : ''}
            {attachResume && savedResume?.has_resume ? ' with resume' : ''}
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
