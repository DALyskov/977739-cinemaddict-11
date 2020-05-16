export default class Comments {
  constructor() {
    this._comments = [];

    // this._dataChangeHandlers = [];
    // this._filterChangeHandlers = [];
  }

  setComments(comments) {
    this._comments = Array.from(comments);
    // this._comments = this._comments.concat(comments);
    // this._callHandlers(this._dataChangeHandlers);
  }

  // getCommentById(id) {
  //   const v = this._comments.forEach((v) => v);
  //   // return this._comments.filter((comment) => comment.id === id);
  //   const index = this._comments.findIndex((it) => it.id === id);

  //   return this._comments[index];
  // }

  getComments() {
    return this._comments;
  }


  removeComment(id) {
    const index = this._comments.findIndex((v) => v.id === id);

    if (index === -1) {
      return false;
    }

    this._comments = [].concat(this._comments.slice(0, index), this._comments.slice(index + 1));

    // this._callHandlers(this._dataChangeHandlers);
    return true;
  }

  // setDataChangeHandler(handler) {
  //   this._dataChangeHandlers.push(handler);
  // }

  // _callHandlers(handlers) {
  //   handlers.forEach((handler) => handler());
  // }
}
