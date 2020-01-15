import html from './proxer-example';
import { getAnimesFromHTML } from './proxerCrawler';
import { exportAnimesToMALAnimeXML, getMALIDFromAnilist } from './animeConverter';

// const animes = getAnimesFromHTML(html);

// findMALAnimeByName('Ninja Hattori-kun', 'TV').then(anime => console.log(anime));

// exportAnimesToMALAnimeXML(animes);

// TODO: von AniList die IDs bekommen und einfügen

console.log(getMALIDFromAnilist('3-gatsu no Lion 2', 'TV'));
