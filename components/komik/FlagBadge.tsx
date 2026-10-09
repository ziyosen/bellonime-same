// FlagBadge — bendera negara SVG tepat (JPN/KOR/CHN), bukan emoji.
export function FlagBadge({ country, size = 18 }: { country?: string | null; size?: number }) {
  const c = (country || '').toUpperCase();
  if (c === 'JP') {
    return (
      <svg width={size} height={size} viewBox="0 0 20 20" className="rounded-full ring-1 ring-black/40 shadow" aria-label="Jepang">
        <circle cx="10" cy="10" r="10" fill="#fff" />
        <circle cx="10" cy="10" r="6" fill="#BC002D" />
      </svg>
    );
  }
  if (c === 'KR') {
    return (
      <svg width={size} height={size} viewBox="0 0 20 20" className="rounded-full ring-1 ring-black/40 shadow" aria-label="Korea">
        <circle cx="10" cy="10" r="10" fill="#fff" />
        {/* taegeuk merah-biru */}
        <path d="M 5.2 10 a 4.8 4.8 0 0 1 9.6 0 a 2.4 2.4 0 0 1 -4.8 0 a 2.4 2.4 0 0 0 -4.8 0 Z" fill="#CD2E3A" transform="rotate(-35 10 10)" />
        <path d="M 5.2 10 a 2.4 2.4 0 0 0 4.8 0 a 2.4 2.4 0 0 1 4.8 0 a 4.8 4.8 0 0 1 -9.6 0 Z" fill="#0047A0" transform="rotate(-35 10 10)" />
        {/* 4 trigram sederhana */}
        <g stroke="#000" strokeWidth="0.7">
          <line x1="3.2" y1="4.6" x2="5.6" y2="3.2" /><line x1="3.4" y1="5.8" x2="5.8" y2="4.4" />
          <line x1="14.4" y1="16.8" x2="16.8" y2="15.4" /><line x1="14.2" y1="15.6" x2="16.6" y2="14.2" />
          <line x1="3.2" y1="15.4" x2="5.6" y2="16.8" /><line x1="3.4" y1="14.2" x2="5.8" y2="15.6" />
          <line x1="14.4" y1="3.2" x2="16.8" y2="4.6" /><line x1="14.2" y1="4.4" x2="16.6" y2="5.8" />
        </g>
      </svg>
    );
  }
  if (c === 'CN') {
    return (
      <svg width={size} height={size} viewBox="0 0 20 20" className="rounded-full ring-1 ring-black/40 shadow" aria-label="China">
        <rect width="20" height="20" fill="#DE2910" />
        <circle cx="7" cy="7" r="3" fill="#FFDE00" />
        <circle cx="12.5" cy="4.5" r="0.9" fill="#FFDE00" />
        <circle cx="14.5" cy="7.5" r="0.9" fill="#FFDE00" />
        <circle cx="14.5" cy="11" r="0.9" fill="#FFDE00" />
        <circle cx="12.5" cy="13.5" r="0.9" fill="#FFDE00" />
      </svg>
    );
  }
  return null;
}
