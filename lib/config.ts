// API utama: wajik-anime-api (live di server Muse, commit 449b8bd)
// BASE lama (bellonime-api-backup.vercel.app) sudah dihapus dari Vercel.
export const API_BASE_URL = 'http://194.14.81.69/wajik-anime-api';

const isServer = typeof window === 'undefined';

export const API_HEADERS = {
  'Accept': 'application/json',
  ...(isServer ? {
    'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36'
  } : {}),
};
