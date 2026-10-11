export default function SiteFooter() {
  return (
    <footer className="mt-10 pb-24 md:pb-6 text-center">
      <div className="flex flex-col items-center gap-1.5">
        <div className="flex items-center gap-2">
          <svg viewBox="0 0 24 24" className="h-5 w-5 text-orange-500" fill="currentColor" role="img" aria-label="NimeKita">
            <path d="M4 3h16a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2zm3 2v2h2V5H7zm8 0v2h2V5h-2zM7 19v2h2v-2H7zm8 0v2h2v-2h-2zM10 9.5v5l4.5-2.5L10 9.5z" />
          </svg>
          <span className="font-extrabold text-sm tracking-wide text-slate-200">
            Nime<span className="text-orange-500">Kita</span>
          </span>
        </div>
        <p className="text-xs text-slate-400 dark:text-slate-500 tracking-wide">
          By: ZeinthHub Project
          <span className="mx-1.5 text-slate-300 dark:text-slate-600">·</span>
          Powered by{' '}
          <a
            href="https://t.me/Bleszh"
            target="_blank"
            rel="noopener noreferrer"
            className="text-slate-500 dark:text-slate-400 hover:text-orange-400 transition-colors"
          >
            @Bleszh
          </a>
        </p>
      </div>
    </footer>
  );
}
