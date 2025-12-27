'use client';

import { useRouter, useSearchParams } from 'next/navigation';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import type { Pagination } from '@/types/anime';

interface PaginationControlsProps {
  pagination: Pagination;
}

export default function PaginationControls({ pagination }: PaginationControlsProps) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const currentPage = Number(searchParams.get('page')) || 1;

  const handlePageChange = (newPage: number) => {
    const params = new URLSearchParams(searchParams.toString());
    params.set('page', newPage.toString());
    router.push(`?${params.toString()}`);
  };

  return (
    <div className="flex items-center justify-center gap-3 mt-8">
      {/* Previous Button */}
      <button
        onClick={() => handlePageChange(currentPage - 1)}
        disabled={!pagination.hasPrevPage}
        className="p-2.5 bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 rounded-lg hover:bg-slate-200 dark:hover:bg-slate-700 disabled:opacity-30 disabled:cursor-not-allowed transition-all"
        aria-label="Previous page"
      >
        <ChevronLeft size={20} />
      </button>

      {/* Page Numbers */}
      <div className="flex items-center gap-2">
        {currentPage > 2 && (
          <>
            <button
              onClick={() => handlePageChange(1)}
              className="min-w-[2.5rem] px-3 py-2 text-sm font-medium bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 rounded-lg hover:bg-slate-200 dark:hover:bg-slate-700 transition-all"
            >
              1
            </button>
            {currentPage > 3 && (
              <span className="text-slate-500 dark:text-slate-400">...</span>
            )}
          </>
        )}

        {currentPage > 1 && (
          <button
            onClick={() => handlePageChange(currentPage - 1)}
            className="min-w-[2.5rem] px-3 py-2 text-sm font-medium bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 rounded-lg hover:bg-slate-200 dark:hover:bg-slate-700 transition-all"
          >
            {currentPage - 1}
          </button>
        )}

        {/* Current Page */}
        <div className="min-w-[2.5rem] px-3 py-2 text-sm font-bold bg-accent text-white rounded-lg">
          {currentPage}
        </div>

        {pagination.hasNextPage && (
          <button
            onClick={() => handlePageChange(currentPage + 1)}
            className="min-w-[2.5rem] px-3 py-2 text-sm font-medium bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 rounded-lg hover:bg-slate-200 dark:hover:bg-slate-700 transition-all"
          >
            {currentPage + 1}
          </button>
        )}

        {pagination.hasNextPage && currentPage + 1 < (pagination.totalPages || currentPage + 2) && (
          <>
            {currentPage + 2 < (pagination.totalPages || currentPage + 2) && (
              <span className="text-slate-500 dark:text-slate-400">...</span>
            )}
            {pagination.totalPages && (
              <button
                onClick={() => handlePageChange(pagination.totalPages!)}
                className="min-w-[2.5rem] px-3 py-2 text-sm font-medium bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 rounded-lg hover:bg-slate-200 dark:hover:bg-slate-700 transition-all"
              >
                {pagination.totalPages}
              </button>
            )}
          </>
        )}
      </div>

      {/* Next Button */}
      <button
        onClick={() => handlePageChange(currentPage + 1)}
        disabled={!pagination.hasNextPage}
        className="p-2.5 bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 rounded-lg hover:bg-slate-200 dark:hover:bg-slate-700 disabled:opacity-30 disabled:cursor-not-allowed transition-all"
        aria-label="Next page"
      >
        <ChevronRight size={20} />
      </button>
    </div>
  );
}