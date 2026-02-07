import type { Movie, ContinueWatchingItem, MovieCategory } from '@/types';
import type {
  DashboardSectionItem,
  MovieApiItem,
  TVShowApiItem,
  ContinueWatchItem,
  DashboardSlider,
  GenreItem,
  CastMember,
} from '@/lib/api';

// Parse genres from different API response formats
function parseGenres(item: { genre?: string[] | string; genres?: string[] | string; genre_list?: Array<{ id: number; name: string }> }): string[] {
  if (item.genre_list && Array.isArray(item.genre_list)) {
    return item.genre_list.map(g => g.name);
  }
  if (item.genres) {
    if (Array.isArray(item.genres)) return item.genres;
    if (typeof item.genres === 'string') return item.genres.split(',').map(g => g.trim()).filter(Boolean);
  }
  if (item.genre) {
    if (Array.isArray(item.genre)) return item.genre;
    if (typeof item.genre === 'string') return item.genre.split(',').map(g => g.trim()).filter(Boolean);
  }
  return [];
}

// Get the best image URL from an API item
function getImageUrl(item: { poster_image?: string; thumbnail_image?: string; image?: string; backdrop_image?: string }, type: 'poster' | 'backdrop' = 'poster'): string {
  if (type === 'backdrop') {
    return item.backdrop_image || item.poster_image || item.image || item.thumbnail_image || '';
  }
  return item.poster_image || item.thumbnail_image || item.image || '';
}

// Convert API items to our Movie type
export function toMovie(item: MovieApiItem | DashboardSectionItem | DashboardSlider | TVShowApiItem): Movie {
  const genres = parseGenres(item);
  const year = Number(item.release_year || item.year || 0);
  const imdbRating = Number(item.imdb_rating || 0);

  return {
    id: String(item.id),
    title: item.title || 'Untitled',
    year: year || new Date().getFullYear(),
    rating: item.censor_rating || item.rating || 'NR',
    duration: item.duration || item.run_time || '',
    imdbRating: imdbRating || 0,
    description: item.description || '',
    posterUrl: getImageUrl(item, 'poster'),
    backdropUrl: getImageUrl(item, 'backdrop') || getImageUrl(item, 'poster'),
    genres,
  };
}

// Convert API items to ContinueWatchingItem type
export function toContinueWatching(item: ContinueWatchItem): ContinueWatchingItem {
  const movie = toMovie(item as unknown as DashboardSectionItem);
  return {
    ...movie,
    progress: item.progress || 0,
    episodeInfo: item.episode_info || (item.season_number && item.episode_number
      ? `S${item.season_number}:E${item.episode_number}`
      : ''),
  };
}

// Convert API TVShow items to our extended format
export function toTVShow(item: TVShowApiItem) {
  const movie = toMovie(item);
  return {
    ...movie,
    seasons: item.total_season || item.seasons || 0,
    episodes: item.total_episode || item.episodes || 0,
    status: (item.status as 'Ongoing' | 'Ended' | 'Cancelled') || 'Ongoing',
    network: item.network || '',
  };
}

// Convert genre items to category format
export function toCategory(genre: GenreItem, movies: Movie[] = []): MovieCategory {
  return {
    id: String(genre.id),
    name: genre.name,
    movies,
  };
}

// Convert cast API items
export function toCast(item: CastMember) {
  return {
    name: item.name || 'Unknown',
    role: item.character || item.role || item.type || '',
    image: item.profile_image || item.image || '',
  };
}

// Batch convert API items to Movie[]
export function toMovieList(items: (MovieApiItem | DashboardSectionItem | DashboardSlider)[]): Movie[] {
  if (!items || !Array.isArray(items)) return [];
  return items.map(toMovie);
}

// Batch convert TV show items
export function toTVShowList(items: TVShowApiItem[]) {
  if (!items || !Array.isArray(items)) return [];
  return items.map(toTVShow);
}
