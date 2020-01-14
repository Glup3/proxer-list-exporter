import html from './proxer-example';
import { getAnimesFromHTML } from './proxerCrawler';

getAnimesFromHTML(html).forEach(a => console.log(a));
