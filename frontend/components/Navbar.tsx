'use client';

import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { useAuth } from '@/context/AuthContext';

export default function Navbar() {
  const { user, logout } = useAuth();
  const pathname = usePathname();
  const router = useRouter();

  const handleLogout = () => { logout(); router.push('/'); };

  return (
    <nav className="w-full bg-[#09090b]/80 backdrop-blur-md border-b border-[#27272a] sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16 items-center">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-lg bg-[#4f46e5] flex items-center justify-center">
              <svg className="w-4 h-4 text-white" viewBox="0 0 24 24" fill="none" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M12 2l8 4.5v9L12 20l-8-4.5v-9L12 2z" /></svg>
            </div>
            <span className="font-bold text-lg text-white tracking-tight">Cavius-Blog</span>
          </Link>

          {/* Center Nav */}
          <div className="hidden md:flex flex-1 justify-center space-x-6">
            <Link href="/" className={`text-sm font-medium transition-colors ${pathname === '/' ? 'text-white' : 'text-gray-400 hover:text-white'}`}>Home</Link>
            <Link href="/blog" className={`text-sm font-medium transition-colors ${pathname === '/blog' ? 'text-white' : 'text-gray-400 hover:text-white'}`}>Articles</Link>
            {user && <Link href="/dashboard" className={`text-sm font-medium transition-colors ${pathname === '/dashboard' ? 'text-white' : 'text-gray-400 hover:text-white'}`}>Workspace</Link>}
          </div>

          {/* Auth right side */}
          <div className="flex items-center gap-4">
            {user ? (
              <>
                <Link href="/blog/create" className="hidden sm:block text-gray-400 hover:text-white font-medium text-sm transition-colors">Create Post</Link>
                <div className="h-4 w-px bg-[#27272a] hidden sm:block"></div>
                <button onClick={handleLogout} className="antigravity-btn px-4 py-2 text-sm font-medium">Log out</button>
              </>
            ) : (
              <>
                <Link href="/auth/login" className="text-gray-400 hover:text-white font-medium text-sm transition-colors">Login</Link>
                <Link href="/auth/register" className="antigravity-btn antigravity-btn-primary px-5 py-2 text-sm font-medium">Get Started</Link>
              </>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
}
