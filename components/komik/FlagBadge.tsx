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
        {/* bintang besar + 4 kecil (bukan circle) */}
        <polygon fill="#FFDE00" points="7,3.4 8.0,6.4 11.2,6.4 8.6,8.3 9.6,11.4 7,9.5 4.4,11.4 5.4,8.3 2.8,6.4 6.0,6.4" />
        <polygon fill="#FFDE00" points="12.5,4.5 12.8,5.4 13.7,5.4 13.0,5.9 13.3,6.8 12.5,6.2 11.7,6.8 12.0,5.9 11.3,5.4 12.2,5.4" />
        <polygon fill="#FFDE00" points="14.50,6.60 14.71,7.21 15.36,7.22 14.84,7.61 15.03,8.23 14.50,7.86 13.97,8.23 14.16,7.61 13.64,7.22 14.29,7.21" />
        <polygon fill="#FFDE00" points="14.50,10.10 14.71,10.71 15.36,10.72 14.84,11.11 15.03,11.73 14.50,11.36 13.97,11.73 14.16,11.11 13.64,10.72 14.29,10.71" />
        <polygon fill="#FFDE00" points="12.50,12.60 12.71,13.21 13.36,13.22 12.84,13.61 13.03,14.23 12.50,13.86 11.97,14.23 12.16,13.61 11.64,13.22 12.29,13.21" />
      </svg>
    );
  }
  return null;
}
