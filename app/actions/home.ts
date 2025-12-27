'use server';

import {
    getGenresData,
    getRecentData,
    getPopularData,
    getCompletedData,
    getHomeData
} from '@/lib/services';
import type { ApiResponse, Genres, Recent, Popular, Completed, Home } from '@/types/anime';

export async function fetchGenres(): Promise<ApiResponse<Genres> | null> {
    try {
        return await getGenresData();
    } catch (error) {
        console.error('Failed to fetch genres:', error);
        return null;
    }
}

export async function fetchRecentAnime(page?: number): Promise<ApiResponse<Recent> | null> {
    try {
        return await getRecentData(page);
    } catch (error) {
        console.error('Failed to fetch recent anime:', error);
        return null;
    }
}

export async function fetchPopularAnime(page?: number): Promise<ApiResponse<Popular> | null> {
    try {
        return await getPopularData(page);
    } catch (error) {
        console.error('Failed to fetch popular anime:', error);
        return null;
    }
}

export async function fetchCompletedAnime(page?: number): Promise<ApiResponse<Completed> | null> {
    try {
        return await getCompletedData(page);
    } catch (error) {
        console.error('Failed to fetch completed anime:', error);
        return null;
    }
}

export async function fetchHomeData(): Promise<Home | null> {
    try {
        return await getHomeData();
    } catch (error) {
        console.error('Failed to fetch home data:', error);
        return null;
    }
}
