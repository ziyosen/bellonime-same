export default function SiteFooter() {
  return (
    <footer className="mt-10 pb-24 md:pb-6 text-center">
      <p className="text-xs text-slate-400 dark:text-slate-500 tracking-wide">
        <span className="font-bold text-slate-600 dark:text-slate-300">Nime<span className="text-accent">Kita</span></span>
        {' '}By: ZeinthHub Project
        <span className="mx-1.5 text-slate-300 dark:text-slate-600">·</span>
        Powered by{' '}
        <a
          href="https://t.me/Bleszh"
          target="_blank"
          rel="noopener noreferrer"
          className="text-slate-500 dark:text-slate-400 hover:text-accent transition-colors"
        >
          @Bleszh
        </a>
      </p>
    </footer>
  );
}
