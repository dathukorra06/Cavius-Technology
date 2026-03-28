'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/context/AuthContext';

export default function RegisterPage() {
  const { register } = useAuth();
  const router = useRouter();
  const [form, setForm] = useState({ username: '', email: '', password: '', firstName: '', lastName: '' });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault(); setError(''); setLoading(true);
    try { 
      await register(form); 
      router.push('/dashboard'); 
    }
    catch (err: unknown) {
      const e = err as { response?: { data?: { message?: string } } };
      setError(e.response?.data?.message || 'Registration failed. Please try again.');
    } finally { setLoading(false); }
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-4">
      <div className="antigravity-card w-full max-w-[450px] p-8 md:p-10 relative">
        <div className="flex items-center gap-3 mb-8">
          <div className="w-8 h-8 rounded-lg bg-[#4f46e5] flex items-center justify-center shadow-lg shadow-indigo-500/20">
            <svg className="w-4 h-4 text-white" viewBox="0 0 24 24" fill="none" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M12 2l8 4.5v9L12 20l-8-4.5v-9L12 2z" />
            </svg>
          </div>
          <span className="font-semibold text-lg text-white">Cavius-Blog</span>
        </div>

        <h1 className="text-3xl font-bold text-white mb-1 tracking-tight">Create account</h1>
        <p className="text-gray-400 italic text-sm mb-8 font-medium">Join us today.</p>

        {error && (
          <div className="mb-6 p-3 rounded-lg text-sm flex items-center gap-2 bg-red-900/20 border border-red-500/30 text-red-400">
            <span>⚠️</span> {error}
          </div>
        )}

        <div className="flex bg-[#1a1a24] border border-[#27272a] rounded-xl p-1 mb-8 shadow-inner">
          <Link href="/auth/login" className="flex-1 text-gray-500 hover:text-gray-300 text-sm font-medium rounded-lg py-2.5 text-center transition-colors">
            Sign in
          </Link>
          <div className="flex-1 bg-[#4b32c3] text-white text-sm font-medium rounded-lg py-2.5 text-center shadow-sm">
            Sign up
          </div>
        </div>

        <div className="flex flex-col gap-4">
          <div className="grid grid-cols-2 gap-3">
            <input
              id="firstName" type="text" placeholder="First Name"
              value={form.firstName} onChange={(e) => setForm({ ...form, firstName: e.target.value })}
              className="antigravity-input py-3.5 text-sm placeholder:text-neutral-500 border-neutral-700/50"
              style={{ background: 'rgba(255,255,255,0.02)' }}
            />
            <input
              id="lastName" type="text" placeholder="Last Name"
              value={form.lastName} onChange={(e) => setForm({ ...form, lastName: e.target.value })}
              className="antigravity-input py-3.5 text-sm placeholder:text-neutral-500 border-neutral-700/50"
              style={{ background: 'rgba(255,255,255,0.02)' }}
            />
          </div>
          <input
            id="username" type="text" required placeholder="Username *"
            value={form.username} onChange={(e) => setForm({ ...form, username: e.target.value })}
            className="antigravity-input py-3.5 text-sm placeholder:text-neutral-500 border-neutral-700/50"
            style={{ background: 'rgba(255,255,255,0.02)' }}
          />
          <input
            id="email" type="email" required placeholder="Email address *"
            value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })}
            className="antigravity-input py-3.5 text-sm placeholder:text-neutral-500 border-neutral-700/50"
            style={{ background: 'rgba(255,255,255,0.02)' }}
            onKeyDown={(e) => e.key === 'Enter' && handleSubmit(e as any)}
          />
          <input
            id="password" type="password" required placeholder="Password * (min 6 chars)"
            value={form.password} onChange={(e) => setForm({ ...form, password: e.target.value })}
            className="antigravity-input py-3.5 text-sm placeholder:text-neutral-500 border-neutral-700/50"
            style={{ background: 'rgba(255,255,255,0.02)' }}
            onKeyDown={(e) => e.key === 'Enter' && handleSubmit(e as any)}
          />

          <button
            type="button" onClick={handleSubmit} disabled={loading}
            className="antigravity-btn antigravity-btn-primary w-full py-3.5 mt-2 text-sm font-medium flex items-center justify-center gap-2"
          >
            {loading ? 'Creating account...' : 'Create Account →'}
          </button>
        </div>
      </div>
    </div>
  );
}
