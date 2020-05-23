import {FilterType} from '../const.js';
import {getFilmByFilter} from '../utils/filter';

export default class Films {
  constructor() {
    this._films = [];
    this._activeFilterType = FilterType.ALL;

    this._dataChangeHandlers = [];
    this._filterChangeHandlers = [];
  }

  setFilms(films) {
    this._films = Array.from(films);
    this._callHandlers(this._dataChangeHandlers);
  }

  getFilmsAll() {
    return this._films;
  }

  getFilms() {
    return getFilmByFilter(this._films, this._activeFilterType);
  }

  getWatchedFilms() {
    return getFilmByFilter(this._films, FilterType.HISTORY);
  }

  updateFilm(id, film) {
    const index = this._films.findIndex((v) => v.id === id);

    if (index === -1) {
      return;
    }

    this._films = [].concat(this._films.slice(0, index), film, this._films.slice(index + 1));

    this._changedFilm = film;

    this._callHandlers(this._dataChangeHandlers);
  }

  setChangedFilm(film) {
    this._changedFilm = film;
  }

  getChangedFilm() {
    return this._changedFilm;
  }

  setFilter(filterType) {
    this._activeFilterType = filterType;
    this._callHandlers(this._filterChangeHandlers);
  }

  setFilterChangeHandler(handler) {
    this._filterChangeHandlers.push(handler);
  }

  setDataChangeHandler(handler) {
    this._dataChangeHandlers.push(handler);
  }

  removeDataChangeHandler(removableHandler) {
    this._dataChangeHandlers = this._dataChangeHandlers
      .filter((handler) => handler !== removableHandler);
  }

  _callHandlers(handlers) {
    handlers.forEach((handler) => handler());
  }
}
