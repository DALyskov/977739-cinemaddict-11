import Film from './models/film.js';
import Comment from './models/comment.js';

const Method = {
  GET: `GET`,
  POST: `POST`,
  PUT: `PUT`,
  DELETE: `DELETE`
};

const checkStatus = (response) => {
  if (response.status >= 200 && response.status < 300) {
    return response;
  } else {
    throw new Error(`${response.status}: ${response.statusText}`);
  }
};

export default class API {
  constructor(endPoint, authorization) {
    this._endPoint = endPoint;
    this._authorization = authorization;
  }

  getFilms() {
    return this._load({url: `movies`})
      .then((response) => response.json())
      .then(Film.parseFilms);
  }

  updateFilm(id, data) {
    return this._load({
      url: `movies/${id}`,
      method: Method.PUT,
      body: JSON.stringify(data.toRAW()),
      headers: new Headers({"Content-Type": `application/json`})
    })
      .then((response) => response.json())
      .then(Film.parseFilm);
  }

  getComments(id) {
    return this._load({url: `comments/${id}`})
      .then((response) => response.json())
      .then(Comment.parseComments);
  }

  createComment(filmId, comment) {
    return this._load({
      url: `1comments/${filmId}`,
      method: Method.POST,
      body: JSON.stringify(comment.toRAW()),
      headers: new Headers({"Content-Type": `application/json`})
    })
      .then((response) => response.json())
      .then(({movie, comments}) => {
        const updatedFilm = Film.parseFilm(movie);
        const updatedCommens = Comment.parseComments(comments);
        return {updatedFilm, updatedCommens};
      });
  }

  deleteComment(commentId) {
    return this._load({url: `1comments/${commentId}`, method: Method.DELETE});
  }

  _load({url, method = Method.GET, body = null, headers = new Headers()}) {
    headers.append(`Authorization`, this._authorization);

    return fetch(`${this._endPoint}/${url}`, {method, body, headers})
      .then(checkStatus)
      .catch((err) => {
        throw err;
      });
  }

  // _load({url, method = Method.GET, body = null, headers = new Headers()}) {
  //   headers.append(`Authorization`, this._authorization);

  //   return this._timeout(1000, fetch(`${this._endPoint}/${url}`, {method, body, headers}))
  //     .then(checkStatus)
  //     .catch((err) => {
  //       throw err;
  //     });
  // }

  // _timeout(ms, promise) {
  //   return new Promise((resolve, reject) => {
  //     setTimeout(() => {
  //       reject(new Error(`timeout`));
  //     }, ms);
  //     promise.then(resolve, reject);
  //   });
  // }


  // _load({url, method = Method.GET, body = null, headers = new Headers()}) {
  //   headers.append(`Authorization`, this._authorization);

  //   return Promise.race([
  //     fetch(`${this._endPoint}/${url}`, {method, body, headers}),
  //     new Promise((_, reject) => setTimeout(() => reject(new Error(`timeout`)), 1000))
  //   ])
  //     .then(checkStatus)
  //     .catch((err) => {
  //       throw err;
  //     });
  // }
}
