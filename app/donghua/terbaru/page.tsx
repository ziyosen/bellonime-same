import DonghuaListPage from '@/components/donghua/DonghuaListPage';

export default function DonghuaTerbaruPageRoute() {
  return <DonghuaListPage title="Terbaru" kind="latest" totalPages={12} />;
}
