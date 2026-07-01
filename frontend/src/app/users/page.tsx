'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import DashboardLayout from '@/components/layout/DashboardLayout';
import Button from '@/components/ui/Button';
import Modal from '@/components/ui/Modal';
import { Input, Select } from '@/components/ui/Input';
import { api } from '@/lib/api';
import { User } from '@/types';

export default function UsersPage() {
  const router = useRouter();
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [modalOpen, setModalOpen] = useState(false);
  const [editing, setEditing] = useState<User | null>(null);
  const [form, setForm] = useState({ name: '', email: '', password: '', role: 'user' });
  const [saving, setSaving] = useState(false);

  const fetchUsers = async () => {
    setLoading(true);
    const res = await api.get<{ users: User[] }>('/users');
    if (res.success && res.data) setUsers(res.data.users);
    setLoading(false);
  };

  useEffect(() => { fetchUsers(); }, []);

  const openCreate = () => {
    setEditing(null);
    setForm({ name: '', email: '', password: '', role: 'user' });
    setModalOpen(true);
  };

  const openEdit = (user: User) => {
    setEditing(user);
    setForm({ name: user.name, email: user.email, password: '', role: user.role });
    setModalOpen(true);
  };

  const handleSave = async () => {
    setSaving(true);
    const payload = { ...form };
    if (editing && !payload.password) delete (payload as Record<string, unknown>).password;

    const res = editing
      ? await api.put(`/users/${editing.id}`, payload)
      : await api.post('/users', payload);

    if (res.success) {
      setModalOpen(false);
      fetchUsers();
    } else {
      alert(res.message);
    }
    setSaving(false);
  };

  const handleDelete = async (id: number) => {
    if (!confirm('Delete this user?')) return;
    const res = await api.delete(`/users/${id}`);
    if (res.success) fetchUsers();
    else alert(res.message);
  };

  return (
    <DashboardLayout title="Manage Users" action={<Button onClick={openCreate}>Add User</Button>}>
      {loading ? (
        <div className="flex justify-center py-20">
          <div className="w-8 h-8 border-2 border-accent/30 border-t-accent rounded-full animate-spin" />
        </div>
      ) : (
        <div className="card overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-card-border text-muted">
                <th className="text-left py-3 px-2">Name</th>
                <th className="text-left py-3 px-2">Email</th>
                <th className="text-left py-3 px-2">Role</th>
                <th className="text-left py-3 px-2">Created</th>
                <th className="text-right py-3 px-2">Actions</th>
              </tr>
            </thead>
            <tbody>
              {users.map((user) => (
                <tr key={user.id} className="border-b border-card-border/50">
                  <td className="py-3 px-2">{user.name}</td>
                  <td className="py-3 px-2">{user.email}</td>
                  <td className="py-3 px-2 capitalize">{user.role.replace('_', ' ')}</td>
                  <td className="py-3 px-2 text-muted">
                    {user.created_at ? new Date(user.created_at).toLocaleDateString() : '-'}
                  </td>
                  <td className="py-3 px-2 text-right space-x-2">
                    <button
                      onClick={() => router.push(`/users/${user.id}`)}
                      className="text-accent hover:underline text-sm"
                    >
                      View
                    </button>
                    <button onClick={() => openEdit(user)} className="text-accent hover:underline text-sm">Edit</button>
                    <button onClick={() => handleDelete(user.id)} className="text-danger hover:underline text-sm">Delete</button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      <Modal isOpen={modalOpen} onClose={() => setModalOpen(false)} title={editing ? 'Edit User' : 'Add User'}>
        <div className="space-y-4">
          <Input label="Name" value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} required />
          <Input label="Email" type="email" value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} required />
          <Input
            label={editing ? 'Password (leave blank to keep)' : 'Password'}
            type="password"
            value={form.password}
            onChange={(e) => setForm({ ...form, password: e.target.value })}
            required={!editing}
          />
          <Select
            label="Role"
            value={form.role}
            onChange={(e) => setForm({ ...form, role: e.target.value })}
            options={[
              { value: 'user', label: 'User' },
              { value: 'super_admin', label: 'Super Admin' },
            ]}
          />
          <div className="flex justify-end gap-2">
            <Button variant="secondary" onClick={() => setModalOpen(false)}>Cancel</Button>
            <Button onClick={handleSave} loading={saving}>Save</Button>
          </div>
        </div>
      </Modal>
    </DashboardLayout>
  );
}
