'use client';

import { useEffect, useState } from 'react';
import DashboardLayout from '@/components/layout/DashboardLayout';
import Button from '@/components/ui/Button';
import { Input, Select } from '@/components/ui/Input';
import { useAuth } from '@/contexts/AuthContext';
import { api } from '@/lib/api';
import { SmtpSettings } from '@/types';

export default function SmtpSettingsPage() {
  const { user } = useAuth();
  const isAdmin = user?.role === 'super_admin';
  const apiBase = isAdmin ? '/smtp' : '/smtp/my';

  const [form, setForm] = useState<SmtpSettings>({
    host: '',
    port: 587,
    username: '',
    password: '',
    encryption: 'tls',
  });
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [testing, setTesting] = useState(false);
  const [message, setMessage] = useState('');

  useEffect(() => {
    api.get<SmtpSettings>(apiBase).then((res) => {
      if (res.success && res.data) {
        setForm({
          host: res.data.host,
          port: res.data.port,
          username: res.data.username,
          password: res.data.password || '',
          encryption: res.data.encryption,
        });
      }
      setLoading(false);
    });
  }, [apiBase]);

  const handleSave = async () => {
    setSaving(true);
    setMessage('');
    const res = await api.post<SmtpSettings>(apiBase, form);
    if (res.success) {
      setMessage('SMTP settings saved successfully');
    } else {
      setMessage(res.message);
    }
    setSaving(false);
  };

  const handleTest = async () => {
    setTesting(true);
    setMessage('');
    const res = await api.post(`${apiBase}/test`);
    setMessage(res.success ? 'SMTP connection successful!' : res.message);
    setTesting(false);
  };

  if (loading) {
    return (
      <DashboardLayout title="SMTP Settings">
        <div className="flex justify-center py-20">
          <div className="w-8 h-8 border-2 border-accent/30 border-t-accent rounded-full animate-spin" />
        </div>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout title="SMTP Settings">
      <div className="card max-w-lg space-y-4">
        <p className="text-sm text-muted">
          {isAdmin
            ? 'Configure global SMTP settings used as fallback when users have no own SMTP configured.'
            : 'Add your own email SMTP credentials. Emails will be sent from your email address (Username field).'}
        </p>

        <Input label="Host" value={form.host} onChange={(e) => setForm({ ...form, host: e.target.value })} placeholder="smtp.gmail.com" required />
        <Input label="Port" type="number" value={form.port} onChange={(e) => setForm({ ...form, port: Number(e.target.value) })} required />
        <Input
          label="Your Email (From Address)"
          value={form.username}
          onChange={(e) => setForm({ ...form, username: e.target.value })}
          placeholder="you@gmail.com"
          required
        />
        <Input label="Password / App Password" type="password" value={form.password} onChange={(e) => setForm({ ...form, password: e.target.value })} required />
        <Select
          label="Encryption"
          value={form.encryption}
          onChange={(e) => setForm({ ...form, encryption: e.target.value as SmtpSettings['encryption'] })}
          options={[
            { value: 'tls', label: 'TLS' },
            { value: 'ssl', label: 'SSL' },
            { value: 'none', label: 'None' },
          ]}
        />

        {message && (
          <p className={`text-sm ${message.includes('success') ? 'text-success' : message.includes('failed') ? 'text-danger' : 'text-muted'}`}>
            {message}
          </p>
        )}

        <div className="flex gap-2">
          <Button onClick={handleSave} loading={saving}>Save Settings</Button>
          <Button variant="secondary" onClick={handleTest} loading={testing}>Test Connection</Button>
        </div>
      </div>
    </DashboardLayout>
  );
}
