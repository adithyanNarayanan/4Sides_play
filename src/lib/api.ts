const API_BASE = 'https://portal.4sidesplay.com/api';

// Helper to get auth token from localStorage
function getAuthToken(): string | null {
  return localStorage.getItem('auth_token');
}

// Helper to get stored user ID
function getUserId(): string | null {
  return localStorage.getItem('user_id');
}

interface ApiOptions {
  method?: 'GET' | 'POST' | 'DELETE';
  body?: Record<string, unknown>;
  requiresAuth?: boolean;
}

export async function apiFetch<T = unknown>(
  endpoint: string,
  options: ApiOptions = {}
): Promise<T> {
  const { method = 'GET', body, requiresAuth = false } = options;

  const headers: Record<string, string> = {
    'Content-Type': 'application/json',
    Accept: 'application/json',
  };

  const token = getAuthToken();
  if (requiresAuth && token) {
    headers['Authorization'] = `Bearer ${token}`;
  }

  const config: RequestInit = {
    method,
    headers,
  };

  if (body && method !== 'GET') {
    config.body = JSON.stringify(body);
  }

  const url = `${API_BASE}/${endpoint}`;
  const response = await fetch(url, config);

  if (!response.ok) {
    const errorData = await response.json().catch(() => ({}));
    throw new ApiError(
      errorData.message || `API error: ${response.status}`,
      response.status,
      errorData
    );
  }

  return response.json();
}

export class ApiError extends Error {
  status: number;
  data: unknown;

  constructor(message: string, status: number, data?: unknown) {
    super(message);
    this.name = 'ApiError';
    this.status = status;
    this.data = data;
  }
}

// ========== AUTH APIs ==========

export interface LoginPayload {
  email: string;
  password: string;
}

export interface RegisterPayload {
  name: string;
  email: string;
  password: string;
  password_confirmation?: string;
}

export interface AuthResponse {
  status: boolean;
  message: string;
  data?: {
    id: number;
    name: string;
    email: string;
    token?: string;
    api_token?: string;
    profile_image?: string;
    [key: string]: unknown;
  };
  token?: string;
  api_token?: string;
}

export async function login(payload: LoginPayload): Promise<AuthResponse> {
  return apiFetch<AuthResponse>('login', {
    method: 'POST',
    body: payload as unknown as Record<string, unknown>,
  });
}

export async function register(payload: RegisterPayload): Promise<AuthResponse> {
  return apiFetch<AuthResponse>('register', {
    method: 'POST',
    body: payload as unknown as Record<string, unknown>,
  });
}

export async function logout(): Promise<{ status: boolean; message: string }> {
  return apiFetch('logout', {
    method: 'POST',
    requiresAuth: true,
  });
}

export async function forgotPassword(email: string) {
  return apiFetch('forgot-password', {
    method: 'POST',
    body: { email },
  });
}

// ========== DASHBOARD / HOME APIs ==========

export interface DashboardResponse {
  status: boolean;
  data?: {
    slider?: DashboardSlider[];
    banner?: DashboardBanner[];
    continue_watch?: ContinueWatchItem[];
    section?: DashboardSection[];
    [key: string]: unknown;
  };
  [key: string]: unknown;
}

export interface DashboardSlider {
  id: number;
  title: string;
  description?: string;
  poster_image?: string;
  thumbnail_image?: string;
  image?: string;
  type?: string;
  genre?: string[];
  genres?: string[];
  release_year?: number | string;
  year?: number | string;
  imdb_rating?: number | string;
  rating?: string;
  duration?: string;
  [key: string]: unknown;
}

export interface DashboardBanner {
  id: number;
  title?: string;
  image?: string;
  poster_image?: string;
  thumbnail_image?: string;
  [key: string]: unknown;
}

export interface ContinueWatchItem {
  id: number;
  title: string;
  poster_image?: string;
  thumbnail_image?: string;
  image?: string;
  progress?: number;
  episode_info?: string;
  episode_number?: number;
  season_number?: number;
  [key: string]: unknown;
}

export interface DashboardSection {
  id?: number;
  title: string;
  type?: string;
  data?: DashboardSectionItem[];
  list?: DashboardSectionItem[];
  [key: string]: unknown;
}

export interface DashboardSectionItem {
  id: number;
  title: string;
  poster_image?: string;
  thumbnail_image?: string;
  image?: string;
  imdb_rating?: number | string;
  rating?: string;
  release_year?: number | string;
  year?: number | string;
  duration?: string;
  genre?: string[] | string;
  genres?: string[] | string;
  description?: string;
  type?: string;
  [key: string]: unknown;
}

export async function getDashboard(): Promise<DashboardResponse> {
  const token = getAuthToken();
  const userId = getUserId();

  if (token && userId) {
    return apiFetch<DashboardResponse>('dashboard-detail', {
      method: 'POST',
      requiresAuth: true,
      body: { user_id: userId },
    });
  }

  return apiFetch<DashboardResponse>('dashboard-detail-data', {
    method: 'POST',
    body: {},
  });
}

// ========== BANNER APIs ==========

export interface BannerResponse {
  status: boolean;
  data?: BannerItem[];
  [key: string]: unknown;
}

export interface BannerItem {
  id: number;
  title?: string;
  description?: string;
  image?: string;
  poster_image?: string;
  thumbnail_image?: string;
  type?: string;
  [key: string]: unknown;
}

export async function getBanners(): Promise<BannerResponse> {
  return apiFetch<BannerResponse>('banner-data', {
    method: 'POST',
    body: {},
  });
}

// ========== MOVIE APIs ==========

export interface MovieListResponse {
  status: boolean;
  data?: MovieApiItem[];
  pagination?: {
    current_page: number;
    last_page: number;
    total: number;
  };
  [key: string]: unknown;
}

export interface MovieApiItem {
  id: number;
  title: string;
  description?: string;
  poster_image?: string;
  thumbnail_image?: string;
  image?: string;
  imdb_rating?: number | string;
  rating?: string;
  censor_rating?: string;
  release_year?: number | string;
  year?: number | string;
  duration?: string;
  run_time?: string;
  genre?: string[] | string;
  genres?: string[] | string;
  genre_list?: Array<{ id: number; name: string }>;
  type?: string;
  is_featured?: boolean;
  views?: number;
  [key: string]: unknown;
}

export interface MovieDetailResponse {
  status: boolean;
  data?: MovieDetailData;
  [key: string]: unknown;
}

export interface MovieDetailData extends MovieApiItem {
  cast?: CastMember[];
  cast_crew?: CastMember[];
  similar_movie?: MovieApiItem[];
  related_movie?: MovieApiItem[];
  trailer_url?: string;
  video_url?: string;
  url_link?: string;
  backdrop_image?: string;
  [key: string]: unknown;
}

export interface CastMember {
  id: number;
  name: string;
  image?: string;
  profile_image?: string;
  role?: string;
  character?: string;
  type?: string;
  [key: string]: unknown;
}

export async function getMovieList(page = 1): Promise<MovieListResponse> {
  return apiFetch<MovieListResponse>('movie-list', {
    method: 'POST',
    body: { page },
  });
}

export async function getMovieDetails(movieId: number | string): Promise<MovieDetailResponse> {
  const token = getAuthToken();
  const userId = getUserId();
  return apiFetch<MovieDetailResponse>('movie-details', {
    method: 'POST',
    requiresAuth: !!token,
    body: { movie_id: movieId, ...(userId ? { user_id: userId } : {}) },
  });
}

// ========== TV SHOW APIs ==========

export interface TVShowListResponse {
  status: boolean;
  data?: TVShowApiItem[];
  pagination?: {
    current_page: number;
    last_page: number;
    total: number;
  };
  [key: string]: unknown;
}

export interface TVShowApiItem {
  id: number;
  title: string;
  description?: string;
  poster_image?: string;
  thumbnail_image?: string;
  image?: string;
  imdb_rating?: number | string;
  rating?: string;
  censor_rating?: string;
  release_year?: number | string;
  year?: number | string;
  duration?: string;
  genre?: string[] | string;
  genres?: string[] | string;
  genre_list?: Array<{ id: number; name: string }>;
  total_season?: number;
  seasons?: number;
  total_episode?: number;
  episodes?: number;
  status?: string;
  network?: string;
  [key: string]: unknown;
}

export interface TVShowDetailResponse {
  status: boolean;
  data?: TVShowDetailData;
  [key: string]: unknown;
}

export interface TVShowDetailData extends TVShowApiItem {
  cast?: CastMember[];
  cast_crew?: CastMember[];
  season_list?: SeasonItem[];
  episode_list?: EpisodeItem[];
  similar_tvshow?: TVShowApiItem[];
  related_tvshow?: TVShowApiItem[];
  trailer_url?: string;
  video_url?: string;
  backdrop_image?: string;
  [key: string]: unknown;
}

export interface SeasonItem {
  id: number;
  name: string;
  season_number: number;
  episode_count?: number;
  [key: string]: unknown;
}

export interface EpisodeItem {
  id: number;
  title: string;
  episode_number: number;
  season_number?: number;
  duration?: string;
  image?: string;
  thumbnail_image?: string;
  description?: string;
  [key: string]: unknown;
}

export async function getTVShowList(page = 1): Promise<TVShowListResponse> {
  return apiFetch<TVShowListResponse>('tvshow-list', {
    method: 'POST',
    body: { page },
  });
}

export async function getTVShowDetails(tvShowId: number | string): Promise<TVShowDetailResponse> {
  const token = getAuthToken();
  const userId = getUserId();
  return apiFetch<TVShowDetailResponse>('tvshow-details', {
    method: 'POST',
    requiresAuth: !!token,
    body: { tv_show_id: tvShowId, ...(userId ? { user_id: userId } : {}) },
  });
}

// ========== GENRE APIs ==========

export interface GenreListResponse {
  status: boolean;
  data?: GenreItem[];
  [key: string]: unknown;
}

export interface GenreItem {
  id: number;
  name: string;
  image?: string;
  poster_image?: string;
  [key: string]: unknown;
}

export async function getGenreList(): Promise<GenreListResponse> {
  return apiFetch<GenreListResponse>('genre-list', {
    method: 'POST',
    body: {},
  });
}

// ========== SEARCH APIs ==========

export interface SearchResponse {
  status: boolean;
  data?: SearchResultItem[];
  [key: string]: unknown;
}

export interface SearchResultItem {
  id: number;
  title: string;
  poster_image?: string;
  thumbnail_image?: string;
  image?: string;
  type?: string;
  imdb_rating?: number | string;
  release_year?: number | string;
  [key: string]: unknown;
}

export async function searchContent(query: string): Promise<SearchResponse> {
  return apiFetch<SearchResponse>('search-list', {
    method: 'POST',
    body: { search: query },
  });
}

// ========== USER / PROFILE APIs ==========

export interface UserDetailResponse {
  status: boolean;
  data?: UserData;
  [key: string]: unknown;
}

export interface UserData {
  id: number;
  name: string;
  email: string;
  profile_image?: string;
  phone?: string;
  [key: string]: unknown;
}

export async function getUserDetail(): Promise<UserDetailResponse> {
  return apiFetch<UserDetailResponse>('user-detail', {
    method: 'POST',
    requiresAuth: true,
    body: {},
  });
}

export async function updateProfile(
  data: Partial<{ name: string; email: string; phone: string; profile_image: string }>
) {
  return apiFetch('update-profile', {
    method: 'POST',
    requiresAuth: true,
    body: data,
  });
}

// ========== CONTINUE WATCHING APIs ==========

export interface ContinueWatchListResponse {
  status: boolean;
  data?: ContinueWatchItem[];
  [key: string]: unknown;
}

export async function getContinueWatchList(): Promise<ContinueWatchListResponse> {
  const userId = getUserId();
  return apiFetch<ContinueWatchListResponse>('continuewatch-list', {
    method: 'POST',
    requiresAuth: true,
    body: { user_id: userId },
  });
}

// ========== WATCHLIST APIs ==========

export async function getWatchList() {
  const userId = getUserId();
  return apiFetch('watch-list', {
    method: 'POST',
    requiresAuth: true,
    body: { user_id: userId },
  });
}

export async function saveWatchlist(contentId: number | string, type: string) {
  const userId = getUserId();
  return apiFetch('save-watchlist', {
    method: 'POST',
    requiresAuth: true,
    body: { user_id: userId, entertainment_id: contentId, type },
  });
}

// ========== PLAN / SUBSCRIPTION APIs ==========

export interface PlanListResponse {
  status: boolean;
  data?: PlanItem[];
  [key: string]: unknown;
}

export interface PlanItem {
  id: number;
  name: string;
  price: number | string;
  duration?: number;
  duration_type?: string;
  description?: string;
  [key: string]: unknown;
}

export async function getPlanList(): Promise<PlanListResponse> {
  return apiFetch<PlanListResponse>('plan-list', {
    method: 'POST',
    body: {},
  });
}

// ========== COMING SOON APIs ==========

export async function getComingSoon() {
  return apiFetch('coming-soon', {
    method: 'POST',
    body: {},
  });
}
