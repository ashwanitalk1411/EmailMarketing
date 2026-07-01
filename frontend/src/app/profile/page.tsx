'use client';

import { useState } from 'react';
import DashboardLayout from '@/components/layout/DashboardLayout';
import Button from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { useAuth } from '@/contexts/AuthContext';
import { api } from '@/lib/api';

export default function ProfilePage() {
  const { user, refreshProfile } = useAuth();
  const [form, setForm] = useState({
    name: user?.name || '',
    email: user?.email || '',
    current_password: '',
    new_password: '',
  });
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState('');

  const handleSave = async () => {
    setSaving(true);
    setMessage('');
    const payload: Record<string, string> = {};
    if (form.name !== user?.name) payload.name = form.name;
    if (form.email !== user?.email) payload.email = form.email;
    if (form.new_password) {
      payload.current_password = form.current_password;
      payload.new_password = form.new_password;
    }

    const res = await api.put('/auth/profile', payload);
    if (res.success) {
      setMessage('Profile updated successfully');
      await refreshProfile();
      setForm((f) => ({ ...f, current_password: '', new_password: '' }));
    } else {
      setMessage(res.message);
    }
    setSaving(false);
  };

  return (
    <DashboardLayout title="Profile">
      <div className="card max-w-lg space-y-4">
        <Input label="Name" value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} />
        <Input label="Email" type="email" value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} />
        <div className="border-t border-card-border pt-4">
          <p className="text-sm font-medium mb-3">Change Password</p>
          <div className="space-y-3">
            <Input label="Current Password" type="password" value={form.current_password} onChange={(e) => setForm({ ...form, current_password: e.target.value })} />
            <Input label="New Password" type="password" value={form.new_password} onChange={(e) => setForm({ ...form, new_password: e.target.value })} />
          </div>
        </div>
        {message && (
          <p className={`text-sm ${message.includes('success') ? 'text-success' : 'text-danger'}`}>{message}</p>
        )}
        <Button onClick={handleSave} loading={saving}>Save Changes</Button>
      </div>
    </DashboardLayout>
  );
}
