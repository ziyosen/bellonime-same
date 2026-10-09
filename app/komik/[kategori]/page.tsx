import { notFound } from 'next/navigation';
import KomikListPage from '@/components/komik/KomikListPage';
import { WEST_CATEGORIES, westCategoryLabel } from '@/lib/westmanga';

export default async function KomikKategoriPageRoute({
  params,
}: {
  params: Promise<{ kategori: string }>;
}) {
  const { kategori } = await params;
  if (!WEST_CATEGORIES.some((c) => c.kind === kategori)) notFound();
  return <KomikListPage title={westCategoryLabel(kategori)} mode={{ type: 'kategori', kind: kategori }} totalPages={10} />;
}
