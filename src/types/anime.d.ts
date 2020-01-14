interface Anime {
  title?: string;
  episodesWatched?: number;
  episodesCount?: number;
  status?: 'COMPLETED' | 'WATCHING' | 'DROPPED' | 'PLANNED';
  type?: 'TV' | 'OVA' | 'MOVIE';
}
