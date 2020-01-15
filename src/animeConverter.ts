import { request } from 'graphql-request';
import builder from 'xmlbuilder';

export const getMALIDFromAnilist = async (name: string, type: string) => {
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

  const result = await request('https://graphql.anilist.co', query, {
    query: name,
    type: 'ANIME',
    format: type,
  });

  const anime = result.Page.media[0];

  if (anime.title.romaji.includes(name) || anime.title.english.includes(name)) {
    return anime.idMal;
  }

  return null;
};

export const exportAnimesToMALAnimeXML = async (animes: Anime[]) => {
  const root = builder.create('myanimelist');

  // const promises = [];

  // for (let index = 0; index < animes.length; index++) {
  //   promises.push(findMALAnimeByName(animes[index].title, animes[index].type));
  // }

  // console.log(promises.length);

  // const res = await Promise.all(promises);

  // console.log(res);

  // for (let index = 0; index < animes.length; index++) {
  //   const entry = root.ele('anime');
  //   const id = (await findMALAnimeByName(animes[index].title, animes[index].type)).mal_id;
  // }

  const xml = root.end({ pretty: true });

  return xml;
};
