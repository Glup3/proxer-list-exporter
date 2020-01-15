import axios, { AxiosResponse } from 'axios';
import cheerio from 'cheerio';

// Glup3 ID: 519518
const proxerURL = 'https://proxer.me/user';

enum ListType {
  ANIME = 'anime',
  MANGA = 'manga',
}

const fetchProxerListHTML = async (userId: string, listType: ListType): Promise<AxiosResponse<string>> => {
  try {
    const url = `${proxerURL}/${userId}/${listType}`;
    const response = await axios.get<string, any>(url).catch(e => console.log(e));

    if (response.status !== 200) {
      console.log(`ERROR fetching ${listType} List for User ${userId}`);
      return null;
    }

    return response;
  } catch (error) {
    console.log(error);

    return null;
  }
};

export const fetchProxerAnimeListHTML = async (userId: string) => {
  const result = await fetchProxerListHTML(userId, ListType.ANIME);

  return result.data;
};

export const fetchProxerMangaListHTML = async (userId: string) => {
  const result = await fetchProxerListHTML(userId, ListType.MANGA);

  return result.data;
};

const getAnimeTypeFromString = (s: string) => {
  switch (s) {
    case 'AnimeserieTV':
      return 'TV';
    case 'SpecialOVA':
      return 'OVA';
    case 'Movie':
      return 'MOVIE';
    default:
      return null;
  }
};

const getAnimeStatusFromPosition = (position: number) => {
  switch (position) {
    case 0:
      return 'COMPLETED';
    case 1:
      return 'WATCHING';
    case 2:
      return 'PLANNED';
    case 3:
      return 'DROPPED';
    default:
      return null;
  }
};

export const getAnimesFromHTML = (html: string): ProxerAnime[] => {
  const animes: ProxerAnime[] = [];

  const $ = cheerio.load(html);
  const animeTables = $('#box-table-a');

  animeTables.each((tableIndex, table) => {
    $(table)
      .find('tr[class^=entry]')
      .each((entryIndex, tableEntry) => {
        const data = $(tableEntry).find('td[valign=top]');

        const animeName = $(data.get(0))
          .text()
          .trim();

        const episodes = $(data.get(3))
          .text()
          .split(' / ');

        const animeType = getAnimeTypeFromString($(data.get(1)).text());
        const animeStatus = getAnimeStatusFromPosition(tableIndex);

        const anime: ProxerAnime = {
          title: animeName,
          episodesWatched: parseInt(episodes[0], 10),
          episodesCount: parseInt(episodes[1], 10),
          type: animeType,
          status: animeStatus,
        };

        animes.push(anime);
      });
  });

  return animes;
};
