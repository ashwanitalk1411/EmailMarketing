'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useAuth } from '@/contexts/AuthContext';

const userNav = [
  { href: '/dashboard', label: 'Dashboard', icon: '📊' },
  { href: '/contacts', label: 'Contacts', icon: '👥' },
  { href: '/templates', label: 'Templates', icon: '📝' },
  { href: '/send', label: 'Send Email', icon: '✉️' },
  { href: '/logs', label: 'Email Logs', icon: '📋' },
  { href: '/settings/smtp', label: 'SMTP Settings', icon: '⚙️' },
  { href: '/profile', label: 'Profile', icon: '👤' },
];

const adminNav = [
  { href: '/dashboard', label: 'Dashboard', icon: '📊' },
  { href: '/users', label: 'Manage Users', icon: '👥' },
  { href: '/emails', label: 'All Emails', icon: '✉️' },
  { href: '/logs', label: 'Email Logs', icon: '📋' },
  { href: '/settings/smtp', label: 'SMTP Settings', icon: '⚙️' },
];

export default function Sidebar() {
  const pathname = usePathname();
  const { user, logout } = useAuth();
  const navItems = user?.role === 'super_admin' ? adminNav : userNav;

  return (
    <aside className="w-64 bg-card border-r border-card-border flex flex-col h-screen fixed left-0 top-0">
      <div className="p-6 border-b border-card-border">
        <h1 className="text-xl font-bold text-accent">EmailMark</h1>
        <p className="text-xs text-muted mt-1">Email Marketing Platform</p>
      </div>

      <nav className="flex-1 p-4 space-y-1 overflow-y-auto">
        {navItems.map((item) => {
          const isActive = pathname === item.href || pathname.startsWith(item.href + '/');
          return (
            <Link
              key={item.href}
              href={item.href}
              className={`flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm transition-colors ${
                isActive
                  ? 'bg-accent/10 text-accent font-medium'
                  : 'text-muted hover:text-foreground hover:bg-background'
              }`}
            >
              <span>{item.icon}</span>
              {item.label}
            </Link>
          );
        })}
      </nav>

      <div className="p-4 border-t border-card-border">
        <div className="text-sm mb-2">
          <p className="font-medium truncate">{user?.name}</p>
          <p className="text-xs text-muted truncate">{user?.email}</p>
        </div>
        <button
          onClick={logout}
          className="w-full btn-secondary text-sm py-1.5"
        >
          Logout
        </button>
      </div>
    </aside>
  );
}
