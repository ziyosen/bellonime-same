'use client';

import { use, useEffect, useState } from 'react';
import KomikListPage from '@/components/komik/KomikListPage';
import { fetchWestGenres } from '@/lib/westmanga';

export default function KomikGenrePageRoute({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params);
  const [name, setName] = useState('');

  useEffect(() => {
    let alive = true;
    (async () => {
      try {
        const genres = await fetchWestGenres();
        const found = genres.find((g) => String(g.id) === id);
        if (alive && found) setName(found.name);
      } catch {
        // judul fallback di bawah
      }
    })();
    return () => {
      alive = false;
    };
  }, [id]);

  return <KomikListPage title={name || 'Genre'} mode={{ type: 'genre', genreId: id }} totalPages={10} />;
}
