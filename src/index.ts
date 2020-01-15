import html from './proxer-example';
import { getAnimesFromHTML } from './proxerCrawler';
import { exportAnimesToMALAnimeXML } from './animeConverter';

const animes = getAnimesFromHTML(html);

exportAnimesToMALAnimeXML(animes).then(a => console.log(a));
