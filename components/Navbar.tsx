'use client';

import Link from 'next/link';
import { usePathname, useRouter, useSearchParams } from 'next/navigation';
import { useEffect, useState, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Home, Sun, Moon, Film, Search, Send, Tv, BookOpen } from 'lucide-react';

// Logo yin-yang custom (SVG murni) — permintaan bos untuk tab Donghua
function YinYangIcon({ size = 20 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <circle cx="12" cy="12" r="10.5" stroke="currentColor" strokeWidth="1.5" />
      <path d="M12 1.5a10.5 10.5 0 0 1 0 21 5.25 5.25 0 0 1 0-10.5 5.25 5.25 0 0 0 0-10.5Z" fill="currentColor" />
      <circle cx="12" cy="6.75" r="1.6" className="fill-white dark:fill-slate-900" />
      <circle cx="12" cy="17.25" r="1.6" fill="currentColor" />
    </svg>
  );
}

import { useTheme } from 'next-themes';


export default function Navbar() {
  const pathname = usePathname();
  const router = useRouter();
  const { theme, setTheme } = useTheme();
  const [mounted, setMounted] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const searchParams = useSearchParams();
  const [searchQuery, setSearchQuery] = useState(searchParams.get('q') || '');
  const [isVisible, setIsVisible] = useState(true);
  const lastScrollY = useRef(0);

  useEffect(() => setMounted(true), []);

  useEffect(() => {
    const handleScroll = () => {
      const currentScrollY = window.scrollY;

      // Desktop background logic
      setScrolled(currentScrollY > 20);

      // Mobile hide/show logic
      if (currentScrollY > lastScrollY.current && currentScrollY > 50) {
        setIsVisible(false);
      } else {
        setIsVisible(true);
      }

      lastScrollY.current = currentScrollY;
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      router.push(`/search?q=${encodeURIComponent(searchQuery)}`);
    }
  };

  const [donghuaQuery, setDonghuaQuery] = useState('');
  const handleDonghuaSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (donghuaQuery.trim()) {
      router.push(`/donghua/search?q=${encodeURIComponent(donghuaQuery)}`);
    }
  };

  const [komikQuery, setKomikQuery] = useState('');
  const handleKomikSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (komikQuery.trim()) {
      router.push(`/komik/search?q=${encodeURIComponent(komikQuery)}`);
    }
  };

  if (!mounted) return null;

  const navItems = [
    { href: '/', icon: <Home size={20} />, label: 'Home' },
    { href: '/donghua', icon: <YinYangIcon size={20} />, label: 'Donghua' },
    { href: '/komik', icon: <BookOpen size={20} />, label: 'Comic' },
    { href: 'https://cinema.xinquins.de5.net', icon: <Film size={20} />, label: 'Netflix Clone' },
  ];

  const desktopNavItems = [
    ...navItems,
    { href: '/sumber', icon: <Send size={20} />, label: 'Sumber' },
    { href: 'https://t.me/Bleszh', icon: <Send size={20} />, label: 'Telegram' },
  ];

  return (
    <>
      {/* Desktop Navbar */}
      <motion.nav
        initial={{ y: -100 }}
        animate={{ y: 0 }}
        className={`hidden md:block fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${scrolled
          ? 'bg-white/80 dark:bg-slate-900/80 backdrop-blur-md shadow-soft-md border-b border-slate-200 dark:border-slate-800'
          : 'bg-white dark:bg-slate-900'
          }`}
      >
        <div className="max-w-[1500px] mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16 gap-8">
            {/* Logo */}
            <Link href="/" className="flex items-center gap-3 group flex-shrink-0" aria-label="NimeKita">
              <svg viewBox="0 0 48 34" className="h-9 w-auto drop-shadow-md transition-transform duration-300 group-hover:scale-105" role="img" aria-label="NimeKita">
                <rect x="1" y="1" width="46" height="32" rx="9" fill="#0ea5e9" />
                <path d="M19 10.5v13c0 .8.9 1.3 1.6.9l10-6.5c.6-.4.6-1.4 0-1.8l-10-6.5c-.7-.4-1.6.1-1.6.9z" fill="#fff" />
              </svg>
              <span className="font-extrabold text-xl tracking-wide text-slate-800 dark:text-white">Nime<span className="text-accent">Kita</span></span>
            </Link>

            {/* Desktop Search */}
            <div className="flex-1 max-w-md">
              <form onSubmit={handleSearch} className="relative group">
                <input
                  type="text"
                  placeholder="Cari anime..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-10 pr-4 py-2 bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-full focus:outline-none focus:ring-2 focus:ring-accent focus:border-transparent transition-all text-sm group-hover:bg-slate-50 dark:group-hover:bg-slate-700/50"
                />
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 group-hover:text-accent transition-colors" size={18} />
              </form>
            </div>

            {/* Nav Items */}
            <div className="flex items-center space-x-1">
              {desktopNavItems.map((item) => {
                const isActive = pathname === item.href;
                const isExternal = item.href.startsWith('http');
                return (
                  <Link
                    key={item.href}
                    href={item.href}
                    target={isExternal ? '_blank' : '_self'}
                    rel={isExternal ? 'noopener noreferrer' : ''}
                    className={`relative px-4 py-2 rounded-lg text-sm font-medium transition-all flex items-center space-x-2 ${isActive
                      ? 'text-accent'
                      : 'text-slate-600 dark:text-slate-400 hover:text-accent hover:bg-slate-100 dark:hover:bg-slate-800'
                      }`}
                  >
                    {item.icon}
                    <span>{item.label}</span>
                    {isActive && (
                      <motion.div
                        layoutId="navbar-indicator"
                        className="absolute inset-0 bg-slate-100 dark:bg-slate-800 rounded-lg -z-10"
                        transition={{ type: 'spring', stiffness: 380, damping: 30 }}
                      />
                    )}
                  </Link>
                );
              })}

              {/* Theme Toggle */}
              <button
                onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}
                className="ml-2 p-2 rounded-lg text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
                aria-label="Toggle theme"
              >
                {theme === 'dark' ? <Sun size={18} /> : <Moon size={18} />}
              </button>
            </div>
          </div>
        </div>
      </motion.nav>

      {/* Mobile Top Capsule Navbar */}
      <AnimatePresence>
        <motion.nav
          initial={{ y: 0 }}
          animate={{ y: isVisible ? 0 : -100 }}
          transition={{ duration: 0.3, ease: 'easeInOut' }}
          className={`md:hidden fixed top-4 left-4 right-4 z-50 bg-white/90 dark:bg-slate-900/90 backdrop-blur-lg rounded-full shadow-soft-xl border border-slate-200 dark:border-slate-800 px-4 py-2 ${pathname?.startsWith('/donghua') || pathname?.startsWith('/komik') ? 'hidden' : ''}`}
        >
          <div className="flex items-center gap-3">
            <Link href="/" className="flex items-center gap-2 flex-shrink-0" aria-label="NimeKita">
              <svg viewBox="0 0 48 34" className="h-7 w-auto drop-shadow" role="img" aria-label="NimeKita">
                <rect x="1" y="1" width="46" height="32" rx="9" fill="#0ea5e9" />
                <path d="M19 10.5v13c0 .8.9 1.3 1.6.9l10-6.5c.6-.4.6-1.4 0-1.8l-10-6.5c-.7-.4-1.6.1-1.6.9z" fill="#fff" />
              </svg>
              <span className="font-extrabold text-base tracking-wide whitespace-nowrap text-slate-800 dark:text-white">Nime<span className="text-accent">Kita</span></span>
            </Link>

            {pathname?.startsWith('/donghua') ? (
              <div className="flex-1" />
            ) : (
              <form onSubmit={handleSearch} className="flex-1 relative">
                <input
                  type="text"
                  placeholder="Cari anime..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-9 pr-4 py-1.5 bg-slate-100 dark:bg-slate-800 border-none rounded-full text-sm focus:ring-2 focus:ring-accent/50"
                />
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={16} />
              </form>
            )}

            <button
              onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}
              className="p-2 rounded-full bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400"
            >
              {theme === 'dark' ? <Sun size={18} /> : <Moon size={18} />}
            </button>
          </div>
        </motion.nav>
      </AnimatePresence>

      {/* Donghua Top Search (khusus halaman donghua, selalu tampil) */}
      {pathname?.startsWith('/donghua') ? (
        <form
          onSubmit={handleDonghuaSearch}
          className="fixed inset-x-3 top-3 z-50 flex gap-2 md:hidden"
        >
          <div className="relative flex-1">
            <input
              type="search"
              placeholder="Cari donghua..."
              value={donghuaQuery}
              onChange={(e) => setDonghuaQuery(e.target.value)}
              className="h-11 w-full rounded-full bg-slate-900/90 pl-10 pr-4 text-sm text-white placeholder:text-slate-400 shadow-lg outline-none ring-1 ring-white/15 backdrop-blur focus:ring-2 focus:ring-orange-500"
            />
            <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" size={16} />
          </div>
          <button type="submit" className="h-11 shrink-0 rounded-full bg-orange-500 px-4 text-sm font-extrabold text-white shadow-lg transition hover:bg-orange-400">
            Cari
          </button>
        </form>
      ) : null}

      {/* Komik Top Search (khusus halaman komik, selalu tampil) */}
      {pathname?.startsWith('/komik') ? (
        <form
          onSubmit={handleKomikSearch}
          className="fixed inset-x-3 top-3 z-50 flex gap-2 md:hidden"
        >
          <div className="relative flex-1">
            <input
              type="search"
              placeholder="Cari komik..."
              value={komikQuery}
              onChange={(e) => setKomikQuery(e.target.value)}
              className="h-11 w-full rounded-full bg-slate-900/90 pl-10 pr-4 text-sm text-white placeholder:text-slate-400 shadow-lg outline-none ring-1 ring-white/15 backdrop-blur focus:ring-2 focus:ring-orange-500"
            />
            <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" size={16} />
          </div>
          <button type="submit" className="h-11 shrink-0 rounded-full bg-orange-500 px-4 text-sm font-extrabold text-white shadow-lg transition hover:bg-orange-400">
            Cari
          </button>
        </form>
      ) : null}

      {/* Mobile Bottom Navbar */}
      <AnimatePresence>
        <motion.nav
          initial={{ y: 0 }}
          animate={{ y: isVisible ? 0 : 100 }}
          transition={{ duration: 0.3, ease: 'easeInOut' }}
          className="md:hidden fixed bottom-4 left-4 right-4 z-50 bg-white/90 dark:bg-slate-900/90 backdrop-blur-lg rounded-2xl shadow-soft-xl border border-slate-200 dark:border-slate-800"
        >
          <div className="flex items-center justify-around py-3 px-2">
            {navItems.map((item) => {
              const isActive = pathname === item.href;
              const isExternal = item.href.startsWith('http');
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  target={isExternal ? '_blank' : '_self'}
                  rel={isExternal ? 'noopener noreferrer' : ''}
                  className={`flex flex-col items-center gap-0.5 px-4 py-1.5 rounded-2xl transition-all ${isActive
                    ? 'bg-slate-200/80 dark:bg-slate-700/70 text-accent'
                    : 'text-slate-400 dark:text-slate-500'
                    }`}
                >
                  <motion.div
                    whileTap={{ scale: 0.92 }}
                    className="relative flex flex-col items-center"
                  >
                    {item.icon}
                    <span className="text-[10px] font-semibold">{item.label}</span>
                  </motion.div>
                </Link>
              );
            })}
          </div>
        </motion.nav>
      </AnimatePresence>

      <div className="h-16 hidden md:block" />
      <div className="h-20 md:hidden" />
    </>
  );
}
