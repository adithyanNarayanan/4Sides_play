export interface Movie {
  id: string;
  title: string;
  year: number;
  rating: string;
  duration: string;
  imdbRating: number;
  description: string;
  posterUrl: string;
  backdropUrl?: string;
  genres: string[];
  category?: string;
  progress?: number;
  episodeInfo?: string;
}

export interface MovieCategory {
  id: string;
  name: string;
  movies: Movie[];
}

export interface ContinueWatchingItem extends Movie {
  progress: number;
  episodeInfo: string;
}
