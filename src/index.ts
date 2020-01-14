import { fetchProxerAnimeList, fetchProxerMangaList } from './proxerCrawler';

const html = fetchProxerAnimeList('519518');

html.then(a => console.log(a));
