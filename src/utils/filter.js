import {FilterType} from '../const.js';

export const getFilmByFilter = (films, filterType) => {
  switch (filterType) {
    case FilterType.WATHCHLIST:
      return films.filter((film) => film.fromWatchlist);
    case FilterType.HISTORY:
      return films.filter((film) => film.isWatched);
    case FilterType.FAVORITES:
      return films.filter((film) => film.isFavorite);
  }
  return films;
};
