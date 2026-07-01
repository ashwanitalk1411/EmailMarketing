export interface User {
  id: number;
  name: string;
  email: string;
  role: 'super_admin' | 'user';
  created_at?: string;
}

export interface UserDetail extends User {
  updated_at?: string;
  stats?: {
    total_contacts: number;
    total_templates: number;
    emails_sent: number;
    pending_emails: number;
    failed_emails: number;
  };
  contacts?: Contact[];
  templates?: Template[];
  recent_logs?: EmailLog[];
}

export interface Contact {
  id: number;
  user_id: number;
  name: string;
  email: string;
  created_at: string;
  updated_at: string;
  user_name?: string;
  user_email?: string;
}

export interface Template {
  id: number;
  user_id: number;
  name: string;
  subject: string;
  html_content: string;
  created_at: string;
  updated_at: string;
}

export interface EmailLog {
  id: number;
  user_id: number;
  recipient_email: string;
  subject: string;
  status: 'pending' | 'sending' | 'sent' | 'failed';
  error_message?: string;
  sent_at?: string;
  attachment_name?: string;
  created_at: string;
  updated_at?: string;
  user_name?: string;
  user_email?: string;
}

export interface SmtpSettings {
  id?: number;
  host: string;
  port: number;
  username: string;
  password: string;
  encryption: 'tls' | 'ssl' | 'none';
  updated_at?: string;
}

export interface DashboardStats {
  total_contacts: number;
  emails_sent: number;
  pending_emails: number;
  failed_emails: number;
  recent_logs: EmailLog[];
}

export interface Pagination {
  page: number;
  limit: number;
  total: number;
  totalPages: number;
}

export interface ApiResponse<T = unknown> {
  success: boolean;
  message: string;
  data?: T;
  errors?: { field?: string; message: string }[];
}

export interface ImportSummary {
  total: number;
  saved: number;
  skipped: number;
  invalid: number;
}
