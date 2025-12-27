'use client';

import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { useEffect, useState, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Home, Sun, Moon, List, Film, CalendarDays, Search } from 'lucide-react';
import { useTheme } from 'next-themes';
import Image from 'next/image';


export default function Navbar() {
  const pathname = usePathname();
  const router = useRouter();
  const { theme, setTheme } = useTheme();
  const [mounted, setMounted] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [isVisible, setIsVisible] = useState(true);
  const lastScrollY = useRef(0);

  useEffect(() => setMounted(true), []);

  useEffect(() => {
    const handleScroll = () => {
      const currentScrollY = window.scrollY;
      
      // Desktop background logic
      setScrolled(currentScrollY > 20);

      // Mobile hide/show logic
      // Hide if scrolling down and passed 50px
      // Show if scrolling up
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

  if (!mounted) return null;

  const navItems = [
    { href: '/', icon: <Home size={20} />, label: 'Home' },
    { href: '/jadwal', icon: <CalendarDays size={20} />, label: 'Jadwal' },
    { href: '/movies', icon: <Film size={20} />, label: 'Movies' },
    { href: '/anime', icon: <List size={20} />, label: 'Anime' },
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
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16 gap-8">
            {/* Logo */}
            <Link href="/" className="flex items-center gap-3 group flex-shrink-0">
              <div className="
                w-10 h-10
                rounded-xl
                overflow-hidden
                bg-[#1e293b]
                ring-1 ring-white/10
                shadow-md
                transition-transform duration-300
                group-hover:scale-105
              ">
                <Image
  src="/bellonime.png"
  alt="Bellonime Logo"
  width={40}
  height={40}
  priority
  className="w-full h-full object-contain p-1"
  draggable={false}
/>
              </div>

              <span className="font-extrabold text-xl tracking-wide">
                BelloNime
              </span>
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
              {navItems.map((item) => {
                const isActive = pathname === item.href;
                return (
                  <Link
                    key={item.href}
                    href={item.href}
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
          className="md:hidden fixed top-4 left-4 right-4 z-50 bg-white/90 dark:bg-slate-900/90 backdrop-blur-lg rounded-full shadow-soft-xl border border-slate-200 dark:border-slate-800 px-4 py-2"
        >
          <div className="flex items-center gap-3">
            {/* Logo (Icon Only) */}
            <Link href="/" className="flex-shrink-0">
              <div className="w-8 h-8 rounded-full overflow-hidden bg-[#1e293b] ring-1 ring-white/10 shadow-md">
                <Image
  src="/bellonime.png"
  alt="Bellonime Logo"
  width={32}
  height={32}
  priority
  className="w-full h-full object-contain p-1"
  draggable={false}
/>

              </div>
            </Link>

            {/* Search Bar */}
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

            {/* Theme Toggle */}
            <button
              onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}
              className="p-2 rounded-full bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400"
            >
              {theme === 'dark' ? <Sun size={18} /> : <Moon size={18} />}
            </button>
          </div>
        </motion.nav>
      </AnimatePresence>

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
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className={`flex flex-col items-center space-y-1 px-3 py-2 rounded-xl transition-all ${isActive
                    ? 'text-accent'
                    : 'text-slate-500 dark:text-slate-400'
                    }`}
                >
                  <motion.div
                    whileTap={{ scale: 0.9 }}
                    className="relative"
                  >
                    {item.icon}
                    {isActive && (
                      <motion.div
                        layoutId="mobile-indicator"
                        className="absolute -bottom-2 left-1/2 -translate-x-1/2 w-1 h-1 bg-accent rounded-full"
                      />
                    )}
                  </motion.div>
                  <span className="text-[10px] font-medium">{item.label}</span>
                </Link>
              );
            })}
          </div>
        </motion.nav>
      </AnimatePresence>

      {/* Spacer for fixed desktop navbar only */}
      <div className="h-16 hidden md:block" />
      {/* Spacer for mobile top navbar */}
      <div className="h-20 md:hidden" />
    </>
  );
}
