'use client';

import { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { useAuth } from '@/context/AuthContext';
import { blogApi } from '@/lib/api';
import LoadingSpinner from '@/components/LoadingSpinner';

const CATEGORIES = ['Technology', 'Science', 'Business', 'Health', 'Travel', 'Food', 'Lifestyle', 'General'];

export default function EditBlogPage() {
  const { id } = useParams<{ id: string }>();
  const { user, loading: authLoading } = useAuth();
  const router = useRouter();
  const [form,    setForm]    = useState({ title: '', content: '', category: 'General', tags: '', published: false });
  const [loading, setLoading] = useState(true);
  const [saving,  setSaving]  = useState(false);
  const [error,   setError]   = useState('');

  useEffect(() => {
    if (!authLoading && !user) { router.push('/auth/login'); return; }
    if (!id) return;
    (async () => {
      try {
        const res = await blogApi.getById(id as string);
        const b = res.data.data;
        setForm({ title: b.title, content: b.content, category: b.category || 'General', tags: (b.tags || []).join(', '), published: b.published });
      } catch { router.push('/dashboard'); }
      finally { setLoading(false); }
    })();
  }, [id, user, authLoading, router]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault(); setError(''); setSaving(true);
    try {
      const tags = form.tags.split(',').map((t) => t.trim()).filter(Boolean);
      await blogApi.update(id as string, { ...form, tags });
      router.push(`/blog/${id}`);
    } catch (err: unknown) {
      const e = err as { response?: { data?: { message?: string } } };
      setError(e.response?.data?.message || 'Failed to update blog');
    } finally { setSaving(false); }
  };

  if (authLoading || loading) return <div className="flex justify-center items-center min-h-screen"><LoadingSpinner size="lg" /></div>;

  return (
    <div className="hero-gradient min-h-screen">
      <div className="max-w-3xl mx-auto px-4 sm:px-6 py-12 fade-in">
        <div className="flex items-center gap-3 mb-2">
          <div className="w-1 h-8 rounded-full" style={{ background: 'linear-gradient(180deg, #06b6d4, #7c3aed)' }} />
          <h1 className="text-3xl font-black text-white">Edit Post</h1>
        </div>
        <p className="text-slate-400 ml-5 mb-8">Update your blog post.</p>

        {error && (
          <div className="mb-6 p-4 rounded-xl text-sm flex items-center gap-2" style={{ background: 'rgba(220,38,38,0.08)', border: '1px solid rgba(220,38,38,0.2)', color: '#f87171' }}>
            <span>⚠️</span> {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="flex flex-col gap-6">
          <div className="glass p-6">
            <label className="block text-xs font-semibold text-slate-400 mb-2.5 uppercase tracking-wider">Title *</label>
            <input type="text" required value={form.title} onChange={(e) => setForm({ ...form, title: e.target.value })} className="input-field text-lg font-semibold" />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="glass p-5">
              <label className="block text-xs font-semibold text-slate-400 mb-2.5 uppercase tracking-wider">Category</label>
              <select value={form.category} onChange={(e) => setForm({ ...form, category: e.target.value })} className="input-field">
                {CATEGORIES.map((c) => <option key={c} value={c}>{c}</option>)}
              </select>
            </div>
            <div className="glass p-5">
              <label className="block text-xs font-semibold text-slate-400 mb-2.5 uppercase tracking-wider">Tags</label>
              <input type="text" value={form.tags} onChange={(e) => setForm({ ...form, tags: e.target.value })} className="input-field" />
            </div>
          </div>

          <div className="glass p-6">
            <label className="block text-xs font-semibold text-slate-400 mb-2.5 uppercase tracking-wider">Content *</label>
            <textarea required rows={18} value={form.content} onChange={(e) => setForm({ ...form, content: e.target.value })}
              className="input-field resize-y text-sm" style={{ fontFamily: "var(--font-mono), monospace" }} />
          </div>

          <div className="glass p-5 flex items-center gap-3">
            <input type="checkbox" id="published" checked={form.published}
              onChange={(e) => setForm({ ...form, published: e.target.checked })}
              className="w-4 h-4 accent-purple-500 rounded" />
            <label htmlFor="published" className="text-sm text-slate-300 font-medium">Published <span className="text-slate-500 text-xs">(visible to public)</span></label>
          </div>

          <div className="flex gap-4 pt-2">
            <button type="submit" disabled={saving} className="btn-primary disabled:opacity-50">
              {saving ? <LoadingSpinner size="sm" /> : <><span>💾</span> Save Changes</>}
            </button>
            <button type="button" onClick={() => router.back()} className="btn-ghost">Cancel</button>
          </div>
        </form>
      </div>
    </div>
  );
}
