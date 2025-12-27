import { getScheduleData } from '@/lib/services/ScheduleService';
import ScheduleTabs from '@/components/jadwal/ScheduleTabs';

export const metadata = {
  title: 'Jadwal Rilis Anime',
  description: 'Jadwal rilis anime terbaru setiap harinya.',
};

export default async function SchedulePage() {
  try {
    const scheduleData = await getScheduleData();

    if (!scheduleData || scheduleData.days.length === 0) {
      return (
        <div className="container mx-auto px-4 py-8 text-center">
          <h1 className="text-2xl font-bold text-slate-900 dark:text-slate-100">Jadwal Tidak Ditemukan</h1>
        </div>
      );
    }

    return (
      <main className="min-h-screen pb-28 md:pb-8 md:pt-4">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Header */}
          <div className="mb-8">
            <h1 className="text-3xl md:text-4xl font-bold text-slate-900 dark:text-slate-100 tracking-tight">
              Jadwal Rilis Anime
            </h1>
            <p className="mt-2 text-slate-600 dark:text-slate-400">
              Jadwal anime terbaru setiap harinya
            </p>
          </div>

          {/* Schedule Tabs */}
          <ScheduleTabs scheduleData={scheduleData} />
        </div>
      </main>
    );

  } catch (error) {
    console.error(error);
    return (
      <div className="container mx-auto px-4 py-8 text-center">
        <h1 className="text-2xl font-bold text-red-500">Gagal Memuat Jadwal</h1>
      </div>
    );
  }
}