import axios, { AxiosResponse } from 'axios';
// import cheerio from 'cheerio';

// Glup3 ID: 519518
const proxerURL = 'https://proxer.me/user';

enum ListType {
  ANIME = 'anime',
  MANGA = 'manga',
}

const fetchProxerList = async (userId: string, listType: ListType): Promise<AxiosResponse<string>> => {
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

export const fetchProxerAnimeList = async (userId: string) => {
  const result = await fetchProxerList(userId, ListType.ANIME);

  return result.data;
};

export const fetchProxerMangaList = async (userId: string) => {
  const result = await fetchProxerList(userId, ListType.MANGA);

  return result.data;
};
