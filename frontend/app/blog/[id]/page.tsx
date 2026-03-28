'use client';

import { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { blogApi } from '@/lib/api';
import { useAuth } from '@/context/AuthContext';
import LoadingSpinner from '@/components/LoadingSpinner';
import Link from 'next/link';

interface Blog {
  _id: string; title: string; content: string; excerpt?: string;
  category?: string; tags?: string[];
  author?: { _id: string; username: string; firstName?: string; lastName?: string; bio?: string };
  likes?: string[]; views?: number; createdAt: string; published: boolean;
}

export default function BlogDetailPage() {
  const { id } = useParams<{ id: string }>();
  const { user } = useAuth();
  const router = useRouter();
  const [blog,     setBlog]     = useState<Blog | null>(null);
  const [loading,  setLoading]  = useState(true);
  const [liked,    setLiked]    = useState(false);
  const [likes,    setLikes]    = useState(0);
  const [deleting, setDeleting] = useState(false);

  useEffect(() => {
    if (!id) return;
    (async () => {
      try {
        const res = await blogApi.getById(id);
        const b: Blog = res.data.data;
        setBlog(b);
        setLikes(b.likes?.length ?? 0);
        if (user) setLiked(b.likes?.includes(user.id) ?? false);
      } catch { router.push('/blog'); }
      finally { setLoading(false); }
    })();
  }, [id, user, router]);

  const handleLike = async () => {
    if (!user) { router.push('/auth/login'); return; }
    try { const res = await blogApi.toggleLike(id); setLikes(res.data.data.likes); setLiked((p) => !p); }
    catch { /* ignore */ }
  };

  const handleDelete = async () => {
    if (!confirm('Delete this blog post?')) return;
    setDeleting(true);
    try { await blogApi.delete(id); router.push('/dashboard'); }
    catch { setDeleting(false); }
  };

  if (loading) return <div className="flex justify-center items-center min-h-screen"><LoadingSpinner size="lg" label="Loading article..." /></div>;
  if (!blog) return null;

  const isOwner = user && blog.author?._id === user.id;
  const date = new Date(blog.createdAt).toLocaleDateString('en-US', { day: 'numeric', month: 'long', year: 'numeric' });

  return (
    <div className="hero-gradient min-h-screen">
      <div className="max-w-3xl mx-auto px-4 sm:px-6 py-12 fade-in">
        {/* Back */}
        <Link href="/blog" className="inline-flex items-center gap-2 text-sm text-slate-500 hover:text-purple-400 mb-10 transition-colors duration-300 group">
          <span className="group-hover:-translate-x-1 transition-transform duration-300">←</span> Back to Blogs
        </Link>

        {/* Header */}
        <header className="mb-10">
          <div className="flex items-center gap-3 mb-5">
            {blog.category && <span className="badge">{blog.category}</span>}
            {!blog.published && (
              <span className="text-[10px] px-2.5 py-1 rounded-full font-semibold uppercase tracking-wider" style={{ background: 'rgba(251,191,36,0.1)', color: '#fbbf24', border: '1px solid rgba(251,191,36,0.2)' }}>Draft</span>
            )}
          </div>

          <h1 className="text-4xl sm:text-5xl font-black text-white mb-6 leading-[1.15] tracking-tight">{blog.title}</h1>

          {/* Author + meta */}
          <div className="flex items-center justify-between flex-wrap gap-4">
            <div className="flex items-center gap-3">
              <div className="w-11 h-11 rounded-full flex items-center justify-center text-sm font-bold text-white shadow-lg"
                style={{ background: 'linear-gradient(135deg, #7c3aed, #06b6d4)', boxShadow: '0 4px 15px rgba(124,58,237,0.3)' }}>
                {(blog.author?.firstName || blog.author?.username || '?')[0].toUpperCase()}
              </div>
              <div>
                <p className="text-sm font-semibold text-white">
                  {blog.author?.firstName ? `${blog.author.firstName} ${blog.author.lastName || ''}` : blog.author?.username}
                </p>
                <p className="text-xs text-slate-500">{date}</p>
              </div>
            </div>

            <div className="flex items-center gap-5">
              <span className="flex items-center gap-1.5 text-sm text-slate-500">
                <span className="text-base">👁</span> {blog.views?.toLocaleString() ?? 0}
              </span>
              <button onClick={handleLike}
                className={`flex items-center gap-1.5 text-sm px-3 py-1.5 rounded-full transition-all duration-300 ${liked
                  ? 'text-red-400 bg-red-400/10 border border-red-400/20'
                  : 'text-slate-500 hover:text-red-400 hover:bg-red-400/5 border border-transparent'
                }`}>
                <span className="text-base">{liked ? '❤️' : '🤍'}</span> {likes}
              </button>
            </div>
          </div>
        </header>

        {/* Tags */}
        {blog.tags && blog.tags.length > 0 && (
          <div className="flex flex-wrap gap-2 mb-8">
            {blog.tags.map((t) => <span key={t} className="tag-pill">#{t}</span>)}
          </div>
        )}

        <div className="divider mb-10" />

        {/* Content */}
        <article className="prose max-w-none mb-12" dangerouslySetInnerHTML={{ __html: blog.content.replace(/\n/g, '<br />') }} />

        {/* Author bio */}
        {blog.author?.bio && (
          <>
            <div className="divider mb-8" />
            <div className="glass-subtle p-6 flex items-start gap-4">
              <div className="w-12 h-12 rounded-full flex items-center justify-center text-lg font-bold text-white shrink-0"
                style={{ background: 'linear-gradient(135deg, #7c3aed, #06b6d4)' }}>
                {(blog.author?.firstName || blog.author?.username || '?')[0].toUpperCase()}
              </div>
              <div>
                <p className="font-bold text-white text-sm mb-1">About {blog.author?.firstName || blog.author.username}</p>
                <p className="text-sm text-slate-400 leading-relaxed">{blog.author.bio}</p>
              </div>
            </div>
          </>
        )}

        {/* Owner actions */}
        {isOwner && (
          <>
            <div className="divider my-8" />
            <div className="flex gap-3">
              <Link href={`/blog/edit/${id}`} className="btn-secondary flex-1 sm:flex-initial">✏️ Edit Post</Link>
              <button onClick={handleDelete} disabled={deleting} className="btn-danger flex-1 sm:flex-initial disabled:opacity-50">
                {deleting ? <LoadingSpinner size="sm" /> : '🗑️ Delete Post'}
              </button>
            </div>
          </>
        )}
      </div>
    </div>
  );
}
