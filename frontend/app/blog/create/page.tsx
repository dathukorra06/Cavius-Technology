'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/context/AuthContext';
import { blogApi } from '@/lib/api';
import LoadingSpinner from '@/components/LoadingSpinner';

const CATEGORIES = ['Technology', 'Science', 'Business', 'Health', 'Travel', 'Food', 'Lifestyle', 'General'];

export default function CreateBlogPage() {
  const { user, loading: authLoading, logout } = useAuth();
  const router = useRouter();
  const [form,   setForm]   = useState({ title: '', content: '', category: 'General', tags: '', published: false });
  const [saving, setSaving] = useState(false);
  const [error,  setError]  = useState('');

  useEffect(() => {
    if (!authLoading && !user) router.push('/auth/login');
  }, [user, authLoading, router]);

  const handleSubmit = async (e: React.FormEvent, draft = false) => {
    e.preventDefault(); setError(''); setSaving(true);
    try {
      const tags = form.tags.split(',').map((t) => t.trim()).filter(Boolean);
      await blogApi.create({ ...form, tags, published: !draft });
      router.push('/dashboard');
    } catch (err: unknown) {
      const e = err as { response?: { data?: { message?: string } } };
      setError(e.response?.data?.message || 'Failed to create blog');
    } finally { setSaving(false); }
  };

  if (authLoading || !user) return <div className="flex justify-center items-center min-h-screen text-white"><LoadingSpinner size="lg" /></div>;

  return (
    <div className="min-h-screen text-white pt-6 pb-20 px-4 md:px-8 max-w-7xl mx-auto">
      {/* Header */}
      <div className="flex justify-between items-center mb-16">
        <div onClick={() => router.push('/dashboard')} className="flex items-center gap-3 cursor-pointer">
          <div className="w-8 h-8 rounded-lg bg-[#4f46e5] flex items-center justify-center">
            <svg className="w-4 h-4 text-white" viewBox="0 0 24 24" fill="none" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M12 2l8 4.5v9L12 20l-8-4.5v-9L12 2z" /></svg>
          </div>
          <span className="font-semibold text-lg text-white">Cavius-Blog</span>
        </div>
        <div className="flex items-center gap-4">
          <button onClick={() => router.back()} className="text-sm font-medium text-gray-400 hover:text-white transition-colors">Cancel</button>
          <button onClick={() => { logout(); router.push('/'); }} className="antigravity-btn px-4 py-2 text-sm font-medium">Sign out</button>
        </div>
      </div>

      <div className="max-w-4xl mx-auto">
        <div className="mb-10">
          <h1 className="text-4xl font-bold tracking-tight mb-2">Create Post</h1>
          <p className="text-gray-500 italic text-sm">Draft your next masterpiece.</p>
        </div>

        {error && (
          <div className="mb-6 p-4 rounded-xl text-sm flex items-center gap-2 bg-red-900/10 border border-red-500/20 text-red-500">
            <span>⚠️</span> {error}
          </div>
        )}

        <div className="bg-[#121216] border border-[#27272a] rounded-2xl p-6 md:p-8 shadow-xl">
          <div className="flex flex-col gap-6">
            <div>
              <label className="block text-[10px] uppercase tracking-widest text-gray-600 font-bold mb-3">Post Title</label>
              <input id="blog-title" type="text" required placeholder="Your compelling blog title..."
                value={form.title} onChange={(e) => setForm({ ...form, title: e.target.value })} 
                className="antigravity-input text-lg font-semibold placeholder:text-gray-800" 
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-[10px] uppercase tracking-widest text-gray-600 font-bold mb-3">Category</label>
                <select id="blog-category" value={form.category} onChange={(e) => setForm({ ...form, category: e.target.value })} 
                  className="antigravity-input appearance-none cursor-pointer text-sm">
                  {CATEGORIES.map((c) => <option key={c} value={c} className="bg-[#121216]">{c}</option>)}
                </select>
              </div>
              <div>
                <label className="block text-[10px] uppercase tracking-widest text-gray-600 font-bold mb-3">Tags (comma separated)</label>
                <input id="blog-tags" type="text" placeholder="react, web, coding"
                  value={form.tags} onChange={(e) => setForm({ ...form, tags: e.target.value })} 
                  className="antigravity-input text-sm placeholder:text-gray-800"
                />
              </div>
            </div>

            <div>
              <label className="block text-[10px] uppercase tracking-widest text-gray-600 font-bold mb-3">Content (Markdown supported)</label>
              <textarea id="blog-content" required rows={18} placeholder="Write your blog content here..."
                value={form.content} onChange={(e) => setForm({ ...form, content: e.target.value })}
                className="antigravity-input resize-none text-sm placeholder:text-gray-800 min-h-[400px]" 
              />
            </div>

            <div className="flex items-center gap-4 pt-6 border-t border-[#27272a]/50 border-dashed">
              <button 
                onClick={(e) => handleSubmit(e)} 
                disabled={saving} 
                className="antigravity-btn antigravity-btn-primary px-8 py-3 text-sm font-medium disabled:opacity-50"
              >
                {saving ? 'Publishing...' : 'Publish Post →'}
              </button>
              <button 
                type="button" 
                disabled={saving} 
                onClick={(e) => handleSubmit(e, true)} 
                className="antigravity-btn px-6 py-3 text-sm font-medium disabled:opacity-50"
              >
                Save as Draft
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
