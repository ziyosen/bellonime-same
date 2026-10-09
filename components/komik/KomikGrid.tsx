import KomikCard from '@/components/komik/KomikCard';
import type { WestCard } from '@/lib/westmanga';

export default function KomikGrid({ items }: { items: WestCard[] }) {
  return (
    <div className="grid grid-cols-3 gap-x-4 gap-y-5 sm:grid-cols-4 md:grid-cols-5 lg:grid-cols-6">
      {items.map((item) => (
        <div key={item.slug} className="[&>a]:w-full">
          <KomikCard item={item} />
        </div>
      ))}
    </div>
  );
}
