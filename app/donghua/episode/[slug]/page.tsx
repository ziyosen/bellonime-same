import DonghuaEpisodeClient from './EpisodeClient';

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  return { title: `${slug.replace(/-/g, ' ')} - Donghua Bellonime` };
}

export default function DonghuaEpisodePage({ params }: { params: Promise<{ slug: string }> }) {
  return <DonghuaEpisodeClient slugPromise={params} />;
}
