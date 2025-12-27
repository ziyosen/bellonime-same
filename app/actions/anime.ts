'use server';

import { getBatchDetailData } from '@/lib/services/BatchDetailService';
import { Batchdetail } from '@/types/anime';

export async function fetchBatchDetail(batchId: string): Promise<Batchdetail | null> {
    try {
        const data = await getBatchDetailData(batchId);
        return data;
    } catch (error) {
        console.error('Failed to fetch batch detail:', error);
        return null;
    }
}
