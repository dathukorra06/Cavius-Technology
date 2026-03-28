'use client';

import Link from 'next/link';

interface BlogCardProps {
  blog: {
    _id: string;
    title: string;
    excerpt?: string;
    category?: string;
    tags?: string[];
    author?: { username: string; firstName?: string; lastName?: string };
    likes?: string[];
    views?: number;
    createdAt: string;
    published: boolean;
  };
}

export default function BlogCard({ blog }: BlogCardProps) {
  const dateStr = new Date(blog.createdAt).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
  
  return (
    <div className="bg-[#121216] border border-[#27272a] rounded-3xl p-6 hover:border-gray-500 transition-all group flex flex-col h-full shadow-xl">
      {/* Category and Date */}
      <div className="flex items-center justify-between mb-6">
        {blog.category && (
          <span className="bg-[#4f46e5]/10 text-[#4f46e5] px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-widest border border-[#4f46e5]/20">
            {blog.category}
          </span>
        )}
        <div className="flex items-center text-gray-500 text-[10px] uppercase font-bold tracking-widest">
          {dateStr}
        </div>
      </div>

      {/* Title */}
      <Link href={`/blog/${blog._id}`} className="mb-4">
        <h2 className="text-xl font-bold text-white leading-tight group-hover:text-[#4f46e5] transition-colors line-clamp-2">
          {blog.title}
        </h2>
      </Link>

      {/* Excerpt */}
      {blog.excerpt && (
        <p className="text-gray-500 text-xs mb-6 line-clamp-3 leading-relaxed font-medium italic">
          "{blog.excerpt}"
        </p>
      )}

      {/* Tags */}
      {blog.tags && blog.tags.length > 0 && (
        <div className="flex flex-wrap gap-2 mb-8 mt-auto">
          {blog.tags.slice(0, 3).map((tag) => (
            <span key={tag} className="text-[#4f46e5] text-[10px] font-black uppercase tracking-tighter">
              #{tag}
            </span>
          ))}
        </div>
      )}

      {/* Author and Likes Footer */}
      <div className="flex items-center justify-between pt-6 border-t border-[#27272a]/50 border-dashed mt-auto">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-full bg-[#1a1a24] border border-[#27272a] flex items-center justify-center text-gray-500">
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
            </svg>
          </div>
          <span className="text-xs font-bold text-gray-400">
            {blog.author?.firstName && blog.author?.lastName 
              ? `${blog.author.firstName} ${blog.author.lastName}` 
              : blog.author?.username || 'Writer'}
          </span>
        </div>
        <div className="flex items-center gap-1.5 text-gray-500 text-[11px] font-bold">
          <svg className="w-3.5 h-3.5 hover:text-red-500 transition-colors" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
          </svg>
          {blog.likes?.length || 0}
        </div>
      </div>
    </div>
  );
}
