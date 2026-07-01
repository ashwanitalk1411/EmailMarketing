'use client';

import { useEffect, useState } from 'react';
import DashboardLayout from '@/components/layout/DashboardLayout';
import Button from '@/components/ui/Button';
import Modal from '@/components/ui/Modal';
import { Input, Textarea } from '@/components/ui/Input';
import EmptyState from '@/components/ui/EmptyState';
import { api } from '@/lib/api';
import { Template } from '@/types';

export default function TemplatesPage() {
  const [templates, setTemplates] = useState<Template[]>([]);
  const [loading, setLoading] = useState(true);
  const [modalOpen, setModalOpen] = useState(false);
  const [previewOpen, setPreviewOpen] = useState(false);
  const [editing, setEditing] = useState<Template | null>(null);
  const [previewTemplate, setPreviewTemplate] = useState<Template | null>(null);
  const [form, setForm] = useState({ name: '', subject: '', html_content: '' });
  const [saving, setSaving] = useState(false);

  const fetchTemplates = async () => {
    setLoading(true);
    const res = await api.get<Template[]>('/templates');
    if (res.success && res.data) setTemplates(res.data);
    setLoading(false);
  };

  useEffect(() => { fetchTemplates(); }, []);

  const openCreate = () => {
    setEditing(null);
    setForm({ name: '', subject: '', html_content: '' });
    setModalOpen(true);
  };

  const openEdit = (template: Template) => {
    setEditing(template);
    setForm({ name: template.name, subject: template.subject, html_content: template.html_content });
    setModalOpen(true);
  };

  const handleSave = async () => {
    setSaving(true);
    const res = editing
      ? await api.put(`/templates/${editing.id}`, form)
      : await api.post('/templates', form);
    if (res.success) {
      setModalOpen(false);
      fetchTemplates();
    } else {
      alert(res.message);
    }
    setSaving(false);
  };

  const handleDelete = async (id: number) => {
    if (!confirm('Delete this template?')) return;
    const res = await api.delete(`/templates/${id}`);
    if (res.success) fetchTemplates();
  };

  return (
    <DashboardLayout title="Email Templates" action={<Button onClick={openCreate}>Create Template</Button>}>
      {loading ? (
        <div className="flex justify-center py-20">
          <div className="w-8 h-8 border-2 border-accent/30 border-t-accent rounded-full animate-spin" />
        </div>
      ) : templates.length === 0 ? (
        <EmptyState title="No templates yet" description="Create your first email template" action={<Button onClick={openCreate}>Create Template</Button>} />
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {templates.map((template) => (
            <div key={template.id} className="card">
              <h3 className="font-semibold truncate">{template.name}</h3>
              <p className="text-sm text-muted mt-1 truncate">{template.subject}</p>
              <p className="text-xs text-muted mt-2">
                Updated {new Date(template.updated_at).toLocaleDateString()}
              </p>
              <div className="flex gap-2 mt-4">
                <button onClick={() => { setPreviewTemplate(template); setPreviewOpen(true); }} className="text-sm text-accent hover:underline">Preview</button>
                <button onClick={() => openEdit(template)} className="text-sm text-accent hover:underline">Edit</button>
                <button onClick={() => handleDelete(template.id)} className="text-sm text-danger hover:underline">Delete</button>
              </div>
            </div>
          ))}
        </div>
      )}

      <Modal isOpen={modalOpen} onClose={() => setModalOpen(false)} title={editing ? 'Edit Template' : 'Create Template'} size="lg">
        <div className="space-y-4">
          <Input label="Template Name" value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} required />
          <Input label="Subject" value={form.subject} onChange={(e) => setForm({ ...form, subject: e.target.value })} required />
          <Textarea label="HTML Content" value={form.html_content} onChange={(e) => setForm({ ...form, html_content: e.target.value })} rows={10} required />
          <div className="flex justify-end gap-2">
            <Button variant="secondary" onClick={() => setModalOpen(false)}>Cancel</Button>
            <Button onClick={handleSave} loading={saving}>Save</Button>
          </div>
        </div>
      </Modal>

      <Modal isOpen={previewOpen} onClose={() => setPreviewOpen(false)} title="Template Preview" size="xl">
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
    </DashboardLayout>
  );
}
