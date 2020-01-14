// import html from './proxer-example';
// import { getAnimesFromHTML } from './proxerCrawler';
import { findMALAnimeByName } from './animeConverter';

// getAnimesFromHTML(html).forEach(a => console.log(a));

findMALAnimeByName('Ninja Hattori-kun', 'TV').then(anime => console.log(anime));
