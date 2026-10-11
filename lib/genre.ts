// Normalisasi label genre dari sumber (mis. "Cgdct" -> "CGDCT")
const FIXES: Record<string, string> = {
  cgdct: 'CGDCT',
  ig: 'IG',
  iyashikei: 'Iyashikei',
  jdrama: 'J-Drama',
  cdrama: 'C-Drama',
  ova: 'OVA',
  ona: 'ONA',
  pv: 'PV',
  tv: 'TV',
  cgi: 'CGI',
  mad: 'MAD',
  r15: 'R-15',
  'seinen-wo': 'Seinen',
};

export function labelGenre(raw: string): string {
  const t = (raw || '').trim();
  if (!t) return t;
  const key = t.toLowerCase().replace(/[^a-z0-9-]/g, '');
  if (FIXES[key]) return FIXES[key];
  if (t.length <= 5 && t === t.toUpperCase()) return t; // sudah akronim
  return t.charAt(0).toUpperCase() + t.slice(1).toLowerCase();
}
