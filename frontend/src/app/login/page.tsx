'use client';

import { useState } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import Button from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';

export default function LoginPage() {
  const { login } = useAuth();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      await login(email, password);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Login failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-background p-4">
      <div className="card w-full max-w-md">
        <div className="text-center mb-8">
          <h1 className="text-2xl font-bold text-accent">EmailMark</h1>
          <p className="text-muted mt-2">Sign in to your account</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <Input
            label="Email"
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="you@example.com"
            required
          />
          <Input
            label="Password"
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="Enter your password"
            required
          />

          {error && (
            <div className="bg-danger/10 text-danger text-sm p-3 rounded-lg">{error}</div>
          )}

          <Button type="submit" loading={loading} className="w-full">
            Sign In
          </Button>
        </form>

        <div className="mt-6 p-4 bg-background rounded-lg text-xs text-muted space-y-1">
          <p className="font-medium text-foreground">Demo Credentials:</p>
          <p>Admin: admin@emailmarketing.com / Admin@123</p>
          <p>User: user@emailmarketing.com / User@123</p>
        </div>
      </div>
    </div>
  );
}
