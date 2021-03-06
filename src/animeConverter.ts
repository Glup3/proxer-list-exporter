import { request } from 'graphql-request';
import Bottleneck from 'bottleneck';
import builder from 'xmlbuilder';

/**
 * needed to prevent error 429 'Too Many Requests'
 * DEFAULT Anilist API: 90 Requests per Minute
 * 60 seconds / 90 Requests = 667 ms per Request
 */
export const createLimiter = (requestsPerMinute = 90) => {
  return new Bottleneck({
    reservoir: requestsPerMinute,
    reservoirRefreshAmount: requestsPerMinute,
    reservoirRefreshInterval: 60 * 1000,

    maxConcurrent: 1,
    minTime: (60 * 1000) / requestsPerMinute,
  });
};

const convertProxerTypeToMALType = (type: string) => {
  switch (type) {
    case 'TV':
      return 'TV';
    case 'OVA':
      return 'OVA';
    case 'MOVIE':
      return 'Movie';
    default:
      return null;
  }
};

const convertProxerStatusToMALStatus = (status: string) => {
  switch (status) {
    case 'COMPLETED':
      return 'Completed';
    case 'WATCHING':
      return 'Watching';
    case 'PLANNED':
      return 'Plan to Watch';
    case 'DROPPED':
      return 'Dropped';
    default:
      return null;
  }
};

export const getMALIDFromAnilist = async (name: string, type: string, limiter: Bottleneck) => {
  const query = `
    query ($query: String, $type: MediaType, $format: MediaFormat) {
      Page (perPage: 1) {
        media(search: $query, type: $type, format: $format) {
          idMal
          title {
            romaji
            english
            native
          }
        }
      }
    }
  `;

  const result = await limiter.schedule(() =>
    request('https://graphql.anilist.co', query, {
      query: name,
      type: 'ANIME',
      format: type,
    }).catch(e => {
      console.log(e);
    })
  );

  const anime = result.Page.media[0];

  return anime != null ? anime.idMal : null;
};

export const exportAnimesToMALAnimeXML = async (animes: ProxerAnime[], requestsPerMinute = 90) => {
  const result = await Promise.all(
    animes.map(x => getMALIDFromAnilist(x.title, x.type, createLimiter(requestsPerMinute)))
  );

  const root = builder.create('myanimelist');
  root.com('Created by Glup3 - last update 15-01-2020');

  for (let index = 0; index < result.length; index++) {
    const entry = root.ele('anime');
    entry.ele('series_animedb_id', {}, result[index]);
    entry.ele('series_title', {}, animes[index].title);
    entry.ele('series_type', {}, convertProxerTypeToMALType(animes[index].type));
    entry.ele('series_episodes', {}, animes[index].episodesCount);
    entry.ele('my_watched_episodes', {}, animes[index].episodesWatched);
    entry.ele('my_status', {}, convertProxerStatusToMALStatus(animes[index].status));

    entry.ele('my_id', {}, 0);
    entry.ele('my_start_date', {}, '0000-00-00');
    entry.ele('my_finish_date', {}, '0000-00-00');
    entry.ele('my_rated');
    entry.ele('my_score', {}, 0);
    entry.ele('my_dvd');
    entry.ele('my_storage');

    entry.ele('my_comments');
    entry.ele('my_times_watched', {}, 0);
    entry.ele('my_rewatch_value', {}, 0);
    entry.ele('my_tags');
    entry.ele('my_rewatching', {}, 0);
    entry.ele('my_rewatching_ep', {}, 0);
    entry.ele('update_on_import', {}, 0);
  }

  const xml = root.end({ pretty: true });

  return xml;
};
