import useSWR from 'swr';
import {
  getDashboard,
  getMovieList,
  getMovieDetails,
  getTVShowList,
  getTVShowDetails,
  getGenreList,
  getBanners,
  searchContent,
  getUserDetail,
  getContinueWatchList,
  getPlanList,
  type DashboardResponse,
  type MovieListResponse,
  type MovieDetailResponse,
  type TVShowListResponse,
  type TVShowDetailResponse,
  type GenreListResponse,
  type BannerResponse,
  type SearchResponse,
  type UserDetailResponse,
  type ContinueWatchListResponse,
  type PlanListResponse,
} from '@/lib/api';

// Generic SWR fetcher wrappers that use our API functions
// SWR needs a key, and calls the fetcher function with that key

export function useDashboard() {
  return useSWR<DashboardResponse>('dashboard', getDashboard, {
    revalidateOnFocus: false,
    dedupingInterval: 60000,
  });
}

export function useBanners() {
  return useSWR<BannerResponse>('banners', getBanners, {
    revalidateOnFocus: false,
    dedupingInterval: 60000,
  });
}

export function useMovieList(page = 1) {
  return useSWR<MovieListResponse>(
    `movie-list-${page}`,
    () => getMovieList(page),
    {
      revalidateOnFocus: false,
      dedupingInterval: 30000,
    }
  );
}

export function useMovieDetails(movieId: number | string | undefined) {
  return useSWR<MovieDetailResponse>(
    movieId ? `movie-details-${movieId}` : null,
    () => getMovieDetails(movieId!),
    {
      revalidateOnFocus: false,
      dedupingInterval: 30000,
    }
  );
}

export function useTVShowList(page = 1) {
  return useSWR<TVShowListResponse>(
    `tvshow-list-${page}`,
    () => getTVShowList(page),
    {
      revalidateOnFocus: false,
      dedupingInterval: 30000,
    }
  );
}

export function useTVShowDetails(tvShowId: number | string | undefined) {
  return useSWR<TVShowDetailResponse>(
    tvShowId ? `tvshow-details-${tvShowId}` : null,
    () => getTVShowDetails(tvShowId!),
    {
      revalidateOnFocus: false,
      dedupingInterval: 30000,
    }
  );
}

export function useGenreList() {
  return useSWR<GenreListResponse>('genre-list', getGenreList, {
    revalidateOnFocus: false,
    dedupingInterval: 120000,
  });
}

export function useSearch(query: string) {
  return useSWR<SearchResponse>(
    query ? `search-${query}` : null,
    () => searchContent(query),
    {
      revalidateOnFocus: false,
      dedupingInterval: 10000,
    }
  );
}

export function useUserDetail() {
  const token = typeof window !== 'undefined' ? localStorage.getItem('auth_token') : null;
  return useSWR<UserDetailResponse>(
    token ? 'user-detail' : null,
    getUserDetail,
    {
      revalidateOnFocus: false,
      dedupingInterval: 60000,
    }
  );
}

export function useContinueWatchList() {
  const token = typeof window !== 'undefined' ? localStorage.getItem('auth_token') : null;
  return useSWR<ContinueWatchListResponse>(
    token ? 'continue-watch-list' : null,
    getContinueWatchList,
    {
      revalidateOnFocus: false,
      dedupingInterval: 30000,
    }
  );
}

export function usePlanList() {
  return useSWR<PlanListResponse>('plan-list', getPlanList, {
    revalidateOnFocus: false,
    dedupingInterval: 120000,
  });
}
