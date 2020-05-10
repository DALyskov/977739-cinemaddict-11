export default class Comments {
  constructor() {
    this._comments = [];

    this._dataChangeHandlers = [];
    // this._filterChangeHandlers = [];
  }

  setComments(comments) {
    this._comments = Array.from(comments);
    // this._callHandlers(this._dataChangeHandlers);
  }

  getCommentById(id) {
    const v = this._comments.forEach((v) => v);
    // return this._comments.filter((comment) => comment.id === id);
    const index = this._comments.findIndex((it) => it.id === id);

    return this._comments[index];
  }

  // getFilmsAll() {
  //   return this._films;
  // }

  // updateFilm(id, film) {
  //   const index = this._films.findIndex((v) => v.id === id);

  //   if (index === -1) {
  //     return false;
  //   }

  //   this._films = [].concat(this._films.slice(0, index), film, this._films.slice(index + 1));

  //   this._callHandlers(this._dataChangeHandlers);
  //   return true;
  // }

  removeComment(id) {
    const index = this._comments.findIndex((v) => v.id === id);

    if (index === -1) {
      return false;
    }

    this._comments = [].concat(this._comments.slice(0, index), this._comments.slice(index + 1));

    // this._callHandlers(this._dataChangeHandlers);
    return true;
  }

  // setFilter(filterType) {
  //   this._activeFilterType = filterType;
  //   this._callHandlers(this._filterChangeHandlers);
  // }

  // setFilterChangeHandler(handler) {
  //   this._filterChangeHandlers.push(handler);
  // }

  setDataChangeHandler(handler) {
    this._dataChangeHandlers.push(handler);
  }

  _callHandlers(handlers) {
    handlers.forEach((handler) => handler());
  }
}
