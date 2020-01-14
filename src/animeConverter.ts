import Mal from 'node-myanimelist';

const getMALAnimeTypeByType = (type: string) => {
  switch (type) {
    case 'TV':
      return Mal.types.AnimeType.tv;
    case 'MOVIE':
      return Mal.types.AnimeType.movie;
    case 'OVA':
      return Mal.types.AnimeType.ova;
    default:
      return null;
  }
};

// eslint-disable-next-line import/prefer-default-export
export const findMALAnimeByName = async (name: string, type: string) => {
  const searchResult = await Mal.search().anime({
    q: name,
    type: getMALAnimeTypeByType(type),
    limit: 1,
  });

  const malAnime: MalAnime = searchResult.data.results[0];

  if (malAnime.title.includes(name)) {
    return malAnime;
  }

  return null;
};
