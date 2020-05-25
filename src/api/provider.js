import Film from '../models/film.js';

const isOnline = () => {
  return window.navigator.onLine;
};

const createStoreStructure = (items) => {
  return items.reduce((acc, current) => {
    return Object.assign({}, acc, {
      [current.id]: current,
    });
  }, {});
};

export default class Provider {
  constructor(api, store) {
    this._api = api;
    this._store = store;
    this._isSynced = false;
  }

  getSynceStatus() {
    return this._isSynced;
  }

  getFilms() {
    if (isOnline()) {
      return this._api.getFilms().then((films) => {
        const items = createStoreStructure(films.map((task) => task.toRAW()));
        this._store.setItems(items);
        return films;
      });
    }
    const storeFilms = Object.values(this._store.getItems());
    return Promise.resolve(Film.parseFilms(storeFilms));
  }

  updateFilm(id, film) {
    if (isOnline()) {
      return this._api.updateFilm(id, film).then((newFilm) => {
        this._store.setItem(newFilm.id, newFilm.toRAW());
        return newFilm;
      });
    }

    const localFilm = Film.clone(Object.assign(film, {id}));
    this._store.setItem(id, localFilm.toRAW());
    this._isSynced = false;
    return Promise.resolve(localFilm);
  }

  sync() {
    if (isOnline()) {
      const storeFilms = Object.values(this._store.getItems());
      return this._api.sync(storeFilms).then((response) => {
        const updatedFilms = response.updated;
        const items = createStoreStructure([...updatedFilms]);
        this._store.setItems(items);
        this._isSynced = true;
      });
    }

    return Promise.reject(new Error(`Sync data failed`));
  }

  getComments(id) {
    if (isOnline()) {
      return this._api.getComments(id);
    }

    return Promise.resolve();
  }

  createComment(filmId, comment) {
    if (isOnline()) {
      return this._api.createComment(filmId, comment);
    }

    return Promise.reject(`offline logic is not implemented and is not needed`);
  }

  deleteComment(commentId) {
    if (isOnline()) {
      return this._api.deleteComment(commentId);
    }

    return Promise.reject(`offline logic is not implemented and is not needed`);
  }
}
