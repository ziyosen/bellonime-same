import DonghuaDetailClient from './DetailClient';

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  return { title: `${slug.replace(/-/g, ' ')} - Donghua Bellonime` };
}

export default function DonghuaDetailPage({ params }: { params: Promise<{ slug: string }> }) {
  return <DonghuaDetailClient slugPromise={params} />;
}
