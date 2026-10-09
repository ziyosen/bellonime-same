export const API_BASE_URL =
  process.env.NEXT_PUBLIC_API_BASE_URL || 'https://wajik-anime-api-murex.vercel.app';

const isServer = typeof window === 'undefined';

export const API_HEADERS = {
  'Accept': 'application/json',
  ...(isServer ? { 
    'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36' 
  } : {}), // Kurung kurawal penutup isServer harus di sini
}; // Baru ditutup variabel utamanya di sini
