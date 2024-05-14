export type VideoGames = VideoGame[]

export interface VideoGame {
  slug: string
  name: string
  playtime: number
  platforms: Platform[]
  stores: Store[]
  released: string
  tba: boolean
  background_image: string
  rating: number
  rating_top: number
  ratings: any[]
  ratings_count: number
  reviews_text_count: number
  added: number
  added_by_status: AddedByStatus
  metacritic: any
  suggestions_count: number
  updated: string
  id: number
  score: string
  clip: any
  tags: Tag[]
  esrb_rating: any
  user_game: any
  reviews_count: number
  community_rating: number
  saturated_color: string
  dominant_color: string
  short_screenshots: ShortScreenshot[]
  parent_platforms: ParentPlatform[]
  genres: Genre[]
}

export interface Platform {
  platform: Platform2
}
export interface Tag {
  id: number
  name: string
  slug: string
  language: string
  games_count: number
  image_background: string
}

export interface Platform2 {
  id: number
  name: string
  slug: string
}

export interface Store {
  store: Store2
}

export interface Store2 {
  id: number
  name: string
  slug: string
}

export interface AddedByStatus {
  owned: number
}

export interface ShortScreenshot {
  id: number
  image: string
}

export interface ParentPlatform {
  platform: Platform3
}

export interface Platform3 {
  id: number
  name: string
  slug: string
}
export interface Genre {
  id: number
  name: string
  slug: string
}

//Movies

export interface Rating {
  userId: number
  movieId: number
  rating: number
  timestamp: number
}

export interface Movie {
  adult: boolean
  belongs_to_collection: string
  budget: number
  genres: Genre[]
  homepage: string
  id: number
  imdb_id: string
  original_language: string
  original_title: string
  overview: string
  popularity: number
  poster_path: string
  production_companies: ProductionCompany[]
  production_countries: ProductionCountry[]
  release_date: number
  revenue: number
  runtime: number
  spoken_languages: SpokenLanguage[]
  status: string
  tagline: string
  title: string
  video: boolean
  vote_average: number
  vote_count: number
}

export interface Genre {
  id: number
  name: string
}

export interface ProductionCompany {
  name: string
  id: number
}

export interface ProductionCountry {
  iso_3166_1: string
  name: string
}

export interface SpokenLanguage {
  iso_639_1: string
  name: string
}


//filtros
export interface Filter {
  orderValue: string;
  letter: string;
  genreSelect: string;
  min: number;
  max: number;
  startDate: string;
  endDate: string;
}