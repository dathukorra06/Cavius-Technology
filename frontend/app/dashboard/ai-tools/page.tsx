'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/context/AuthContext';
import { aiApi } from '@/lib/api';
import LoadingSpinner from '@/components/LoadingSpinner';

const TONES   = ['professional', 'casual', 'formal', 'friendly'];
const LENGTHS = ['short', 'medium', 'long'];
type Tool = 'generate' | 'summarize' | 'improve' | 'suggest';

export default function AiToolsPage() {
  const { user, loading: authLoading, logout } = useAuth();
  const router = useRouter();

  const [tool,    setTool]    = useState<Tool>('generate');
  const [input,   setInput]   = useState('');
  const [tone,    setTone]    = useState('professional');
  const [length,  setLength]  = useState('medium');
  const [result,  setResult]  = useState('');
  const [titles,  setTitles]  = useState<string[]>([]);
  const [working, setWorking] = useState(false);
  const [error,   setError]   = useState('');
  const [health,  setHealth]  = useState<{ configured: boolean; model: string } | null>(null);
  const [copied,  setCopied]  = useState(false);

  useEffect(() => {
    if (!authLoading && !user) { router.push('/auth/login'); return; }
    aiApi.health().then((r) => setHealth(r.data.data)).catch(() => {});
  }, [user, authLoading, router]);

  const run = async () => {
    setError(''); setResult(''); setTitles([]); setWorking(true);
    try {
      if (tool === 'generate') {
        const res = await aiApi.generateContent({ topic: input, tone });
        setResult(res.data.data.content);
      } else if (tool === 'summarize') {
        const res = await aiApi.summarize({ text: input, length });
        setResult(res.data.data.summary);
      } else if (tool === 'improve') {
        const res = await aiApi.improveContent({ content: input });
        setResult(res.data.data.improved);
      } else {
        const res = await aiApi.suggestTitle({ content: input });
        setTitles(res.data.data.titles);
      }
    } catch (err: unknown) {
      const e = err as { response?: { data?: { message?: string } } };
      setError(e.response?.data?.message || 'AI request failed.');
    } finally { setWorking(false); }
  };

  const handleCopy = (text: string) => {
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  if (authLoading || !user) return <div className="flex justify-center items-center min-h-screen"><LoadingSpinner size="lg" /></div>;

  const tools: { id: Tool; icon: string; label: string; desc: string; color: string }[] = [
    { id: 'generate',  icon: '✨', label: 'Generate',  desc: 'Full blog from topic',  color: '#7c3aed' },
    { id: 'summarize', icon: '📋', label: 'Summarize', desc: 'Condense long text',    color: '#3b82f6' },
    { id: 'improve',   icon: '⚡', label: 'Improve',   desc: 'Enhance your writing',  color: '#ec4899' },
    { id: 'suggest',   icon: '💡', label: 'Titles',    desc: 'Get 5 title ideas',     color: '#f59e0b' },
  ];

  return (
    <div className="min-h-screen text-white pt-6 pb-20 px-4 md:px-8 max-w-7xl mx-auto">
      {/* Header */}
      <div className="flex justify-between items-center mb-16">
        <Link href="/dashboard" className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-lg bg-[#4f46e5] flex items-center justify-center">
            <svg className="w-4 h-4 text-white" viewBox="0 0 24 24" fill="none" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M12 2l8 4.5v9L12 20l-8-4.5v-9L12 2z" /></svg>
          </div>
          <span className="font-semibold text-lg text-white">Cavius-Blog</span>
        </Link>
        <div className="flex items-center gap-4">
          <Link href="/dashboard" className="text-sm font-medium text-gray-400 hover:text-white transition-colors">
            Workspace
          </Link>
          <button onClick={() => { logout(); router.push('/'); }} className="antigravity-btn px-4 py-2 text-sm font-medium">Sign out</button>
        </div>
      </div>

      <div className="max-w-4xl mx-auto">
        <div className="mb-10">
          <h1 className="text-4xl font-bold tracking-tight mb-2">AI Tools</h1>
          <p className="text-gray-500 italic text-sm">Powered by Gemini - generate, summarize, and brainstorm.</p>
        </div>

        {/* Health status */}
        {health && (
          <div className={`inline-flex items-center gap-2.5 px-4 py-1.5 rounded-full text-[11px] font-medium mb-8 ${health.configured ? 'text-emerald-400' : 'text-amber-400'}`}
            style={{
              background: health.configured ? 'rgba(16,185,129,0.05)' : 'rgba(245,158,11,0.05)',
              border: `1px solid ${health.configured ? 'rgba(16,185,129,0.1)' : 'rgba(245,158,11,0.1)'}`,
            }}>
            <div className={`w-1.5 h-1.5 rounded-full ${health.configured ? 'bg-emerald-400' : 'bg-amber-400'}`} />
            {health.configured ? `AI Ready · ${health.model}` : 'Configure GEMINI_API_KEY in backend .env'}
          </div>
        )}

        {/* Tool selector */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-10">
          {tools.map((t) => {
            const active = tool === t.id;
            return (
              <button key={t.id} onClick={() => { setTool(t.id); setResult(''); setTitles([]); setError(''); }}
                className={`p-5 rounded-2xl text-left transition-all border ${
                  active ? 'border-gray-500 bg-white/5' : 'border-[#27272a] bg-[#121216] hover:bg-[#1a1a24]'
                }`}>
                <div className="text-2xl mb-2">{t.icon}</div>
                <div className={`font-bold text-sm ${active ? 'text-white' : 'text-gray-400'}`}>{t.label}</div>
                <div className="text-[10px] text-gray-600 mt-0.5">{t.desc}</div>
              </button>
            );
          })}
        </div>

        {/* Input Card */}
        <div className="bg-[#121216] border border-[#27272a] rounded-2xl p-6 mb-8 shadow-xl">
          <label className="block text-[10px] uppercase tracking-widest text-[#a1a1aa] font-bold mb-4">
            {tool === 'generate' ? '🎯 Topic or keyword' : tool === 'suggest' ? '📄 Blog content' : '📝 Text to process'}
          </label>
          <textarea 
            rows={tool === 'generate' ? 3 : 8}
            placeholder={tool === 'generate' ? 'e.g. "The future of quantum computing"' : 'Paste your content here...'}
            value={input} onChange={(e) => setInput(e.target.value)}
            className="antigravity-input resize-none text-sm placeholder:text-gray-700 min-h-[120px]" 
          />

          <div className="flex flex-wrap items-center justify-between gap-4 mt-6 pt-6 border-t border-[#27272a]/50 border-dashed">
            <div className="flex gap-4">
              {/* Tone selector */}
              {tool === 'generate' && (
                <div className="flex items-center gap-2">
                  <span className="text-[10px] uppercase font-bold text-gray-600">Tone:</span>
                  <select value={tone} onChange={(e) => setTone(e.target.value)} className="bg-transparent text-xs text-gray-400 outline-none cursor-pointer hover:text-white transition-colors">
                    {TONES.map(t => <option key={t} value={t} className="bg-[#121216]">{t}</option>)}
                  </select>
                </div>
              )}

              {/* Length selector */}
              {tool === 'summarize' && (
                <div className="flex items-center gap-2">
                  <span className="text-[10px] uppercase font-bold text-gray-600">Length:</span>
                  <select value={length} onChange={(e) => setLength(e.target.value)} className="bg-transparent text-xs text-gray-400 outline-none cursor-pointer hover:text-white transition-colors">
                    {LENGTHS.map(l => <option key={l} value={l} className="bg-[#121216]">{l}</option>)}
                  </select>
                </div>
              )}
            </div>

            <button onClick={run} disabled={working || !input.trim()} className="antigravity-btn antigravity-btn-primary px-8 py-2.5 text-sm font-medium disabled:opacity-30">
              {working ? 'Processing...' : 'Run →'}
            </button>
          </div>
        </div>

        {/* Error */}
        {error && (
          <div className="mb-6 p-4 rounded-xl text-sm flex items-center gap-2 bg-red-900/10 border border-red-500/20 text-red-500">
            <span>⚠️</span> {error}
          </div>
        )}

        {/* Result */}
        {result && (
          <div className="bg-[#121216] border border-[#27272a] rounded-2xl p-6 shadow-2xl animate-in fade-in slide-in-from-bottom-4 duration-500">
            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center gap-2">
                <div className="w-1.5 h-1.5 rounded-full bg-emerald-500 shadow-sm shadow-emerald-500/50" />
                <h3 className="font-bold text-white text-xs tracking-wide">AI GENERATED RESULT</h3>
              </div>
              <button onClick={() => handleCopy(result)}
                className="text-[10px] px-3 py-1 rounded-lg border border-[#27272a] hover:bg-white/5 transition-colors uppercase font-bold text-gray-500 hover:text-white">
                {copied ? 'Copied ✅' : 'Copy'}
              </button>
            </div>
            <div className="text-sm text-[#d4d4d8] whitespace-pre-wrap leading-relaxed">
              {result}
            </div>
          </div>
        )}

        {/* Titles */}
        {titles.length > 0 && (
          <div className="bg-[#121216] border border-[#27272a] rounded-2xl p-6 shadow-2xl animate-in fade-in slide-in-from-bottom-4 duration-500">
            <div className="flex items-center gap-2 mb-8">
              <div className="w-1.5 h-1.5 rounded-full bg-amber-500 shadow-sm shadow-amber-500/50" />
              <h3 className="font-bold text-white text-xs tracking-wide">TITLE SUGGESTIONS</h3>
            </div>
            <div className="grid gap-3">
              {titles.map((t, i) => (
                <button key={i} onClick={() => handleCopy(t)}
                  className="flex items-center gap-4 p-4 rounded-xl text-left bg-[#1a1a24]/30 border border-[#27272a] hover:border-gray-500 transition-all hover:bg-white/5 group">
                  <span className="w-7 h-7 rounded-lg bg-[#4f46e5] flex items-center justify-center text-[10px] font-bold shrink-0 shadow-lg shadow-indigo-500/20">
                    {i + 1}
                  </span>
                  <span className="text-sm text-gray-300 group-hover:text-white transition-colors flex-1">{t}</span>
                  <span className="text-[9px] text-gray-700 opacity-0 group-hover:opacity-100 transition-opacity uppercase font-black">Copy</span>
                </button>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
