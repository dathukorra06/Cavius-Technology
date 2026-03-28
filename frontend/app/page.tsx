'use client';

import Link from 'next/link';

export default function HomePage() {
  return (
    <div className="min-h-[calc(100vh-64px)] text-white flex flex-col justify-center items-center text-center px-4 relative overflow-hidden">
      {/* Background Glow */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] bg-[#4f46e5]/10 blur-[120px] rounded-full pointer-events-none" />

      <div className="relative z-10 max-w-4xl mx-auto flex flex-col items-center">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#4f46e5]/10 border border-[#4f46e5]/20 text-[10px] uppercase font-black tracking-widest text-[#4f46e5] mb-8 animate-in fade-in slide-in-from-top-4 duration-1000">
          <span>✨</span> AI-Powered Publishing
        </div>
        
        <h1 className="text-6xl md:text-8xl font-black text-white mb-8 tracking-tighter leading-[0.9] animate-in fade-in slide-in-from-bottom-8 duration-1000">
          Write Smarter. <br /> 
          <span className="text-gray-500">Share Faster.</span>
        </h1>
        
        <p className="text-lg md:text-xl text-gray-500 max-w-2xl mb-12 font-medium leading-relaxed animate-in fade-in slide-in-from-bottom-12 duration-1000 delay-100">
          Unlock the future of content with Cavius-Blog. Brainstorm ideas, draft masterpieces, and manage your workflow in a premium dark workspace.
        </p>

        <div className="flex flex-col sm:flex-row gap-5 animate-in fade-in slide-in-from-bottom-16 duration-1000 delay-200">
          <Link href="/blog" className="antigravity-btn antigravity-btn-primary px-10 py-4 text-sm font-bold shadow-2xl shadow-indigo-500/20">
            Explore Articles →
          </Link>
          <Link href="/auth/register" className="antigravity-btn px-10 py-4 text-sm font-bold border-[#27272a] hover:bg-white/5 transition-all">
            Join the Workspace
          </Link>
        </div>

        {/* Feature Icons */}
        <div className="grid grid-cols-3 gap-12 mt-32 text-gray-600 animate-in fade-in duration-1000 delay-500">
          <div className="flex flex-col items-center gap-2">
            <div className="w-10 h-10 rounded-xl bg-white/5 border border-white/5 flex items-center justify-center text-white">
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" /></svg>
            </div>
            <span className="text-[10px] font-black uppercase tracking-widest">Lightning Fast</span>
          </div>
          <div className="flex flex-col items-center gap-2">
            <div className="w-10 h-10 rounded-xl bg-white/5 border border-white/5 flex items-center justify-center text-white">
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.75 17L9 20l-1 1h8l-1-1-.75-3M3 13h18M5 17h14a2 2 0 002-2V5a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" /></svg>
            </div>
            <span className="text-[10px] font-black uppercase tracking-widest">Premium UI</span>
          </div>
          <div className="flex flex-col items-center gap-2">
            <div className="w-10 h-10 rounded-xl bg-white/5 border border-white/5 flex items-center justify-center text-white">
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19.428 15.428a2 2 0 00-1.022-.547l-2.387-.477a6 6 0 00-3.86.517l-.691.346a6 6 0 01-3.86.517l-2.388-.477a2 2 0 00-1.022.547l-1.16 1.16a2 2 0 002.828 2.828l1.16-1.16a2 2 0 00.547-1.022l.477-2.387a6 6 0 01.517-3.86l.346-.691a6 6 0 01.517-3.86l-.477-2.388a2 2 0 00-.547-1.022l-1.16-1.16a2 2 0 00-2.828 2.828l1.16 1.16a2 2 0 00.547 1.022l.477 2.387a6 6 0 003.86-.517l.691-.346a6 6 0 003.86-.517l2.388.477a2 2 0 001.022-.547l1.16-1.16a2 2 0 00-2.828-2.828l-1.16 1.16z" /></svg>
            </div>
            <span className="text-[10px] font-black uppercase tracking-widest">AI Assisted</span>
          </div>
        </div>
      </div>
    </div>
  );
}
