import Link from 'next/link';

export default function Footer() {
  return (
    <footer className="w-full border-t border-[#27272a] bg-[#09090b] mt-auto">
      <div className="max-w-7xl mx-auto px-4 py-12 sm:px-6 lg:px-8">
        <div className="flex flex-col md:flex-row justify-between items-center gap-8">
          <div className="flex items-center gap-3">
            <div className="w-6 h-6 rounded bg-[#4f46e5] flex items-center justify-center">
              <svg className="w-3 h-3 text-white" viewBox="0 0 24 24" fill="none" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M12 2l8 4.5v9L12 20l-8-4.5v-9L12 2z" /></svg>
            </div>
            <span className="text-white font-bold tracking-tight text-lg">Cavius-Blog</span>
          </div>

          <div className="flex gap-8 text-sm text-gray-400">
            <Link href="/" className="hover:text-white transition-colors">Home</Link>
            <Link href="/blog" className="hover:text-white transition-colors">Articles</Link>
            <Link href="/about" className="hover:text-white transition-colors">About</Link>
          </div>

          <div className="text-gray-500 text-xs font-medium uppercase tracking-widest">
            &copy; {new Date().getFullYear()} Cavius Technology
          </div>
        </div>
      </div>
    </footer>
  );
}
