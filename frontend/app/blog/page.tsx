'use client';

import { useEffect, useState, useCallback } from 'react';
import BlogCard from '@/components/BlogCard';
import { blogApi } from '@/lib/api';
import LoadingSpinner from '@/components/LoadingSpinner';

const CATEGORIES = ['All', 'Technology', 'Lifestyle', 'Design', 'Business', 'Health'];

interface Blog {
  _id: string; title: string; excerpt?: string; category?: string;
  tags?: string[]; author?: { username: string; firstName?: string; lastName?: string };
  likes?: string[]; views?: number; createdAt: string; published: boolean;
}

export default function BlogListPage() {
  const [blogs, setBlogs] = useState<Blog[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [category, setCategory] = useState('All');

  const fetchBlogs = useCallback(async () => {
    setLoading(true);
    try {
      const params: Record<string, unknown> = { limit: 20, published: true };
      if (search) params.search = search;
      if (category && category !== 'All') params.category = category;
      const res = await blogApi.getAll(params);
      setBlogs(res.data.data ?? []);
    } catch { setBlogs([]); }
    finally { setLoading(false); }
  }, [search, category]);

  useEffect(() => { fetchBlogs(); }, [fetchBlogs]);

  return (
    <div className="min-h-screen text-white pt-6 pb-20 px-4 md:px-8 max-w-7xl mx-auto">
      <div className="max-w-7xl mx-auto py-12">
        {/* Header Section */}
        <div className="mb-14">
          <h1 className="text-5xl font-bold tracking-tight mb-4">Discover Articles</h1>
          <p className="text-gray-500 italic text-sm">Explore premium thoughts from our community of writers.</p>
        </div>

        {/* Filter & Search Bar Row */}
        <div className="flex flex-col md:flex-row items-center justify-between gap-6 mb-16">
          {/* Search Input */}
          <div className="relative flex-1 w-full max-w-lg">
            <svg className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-600" viewBox="0 0 24 24" fill="none" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M21 21l-4.35-4.35m1.35-5.65a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
            <input
              id="search" type="text" placeholder="Search articles by title or tags..."
              value={search} onChange={(e) => setSearch(e.target.value)}
              className="antigravity-input pl-12 pr-4 py-3.5 text-sm placeholder:text-gray-800"
            />
          </div>

          {/* Categories */}
          <div className="flex flex-wrap items-center gap-2 overflow-x-auto w-full md:w-auto">
            {CATEGORIES.map((c) => {
              const active = c === category;
              return (
                <button 
                  key={c}
                  onClick={() => setCategory(c)}
                  className={`whitespace-nowrap px-5 py-2.5 rounded-xl text-xs font-semibold uppercase tracking-widest transition-all ${
                    active ? 'bg-[#4f46e5] text-white shadow-lg shadow-indigo-500/20' : 'bg-[#121216] text-gray-500 hover:text-white border border-[#27272a] hover:bg-[#1a1a24]'
                  }`}
                >
                  {c}
                </button>
              );
            })}
          </div>
        </div>

        {/* Dynamic List */}
        {loading ? (
          <div className="flex justify-center items-center py-40"><LoadingSpinner size="lg" /></div>
        ) : blogs.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-40 text-gray-500 bg-[#121216]/50 rounded-3xl border border-[#27272a] border-dashed">
            <svg className="w-12 h-12 mb-4 opacity-20" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
            </svg>
            <p className="text-xl font-bold text-gray-300 mb-2">No Articles Found</p>
            <p className="text-xs text-center px-4">Try adjusting your search criteria or checking a different category.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 pb-32">
            {blogs.map((b) => <BlogCard key={b._id} blog={b} />)}
          </div>
        )}
      </div>
    </div>
  );
}
