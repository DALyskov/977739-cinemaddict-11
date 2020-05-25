import Comment from '../models/comment.js';
import Film from '../models/film.js';

const Method = {
  GET: `GET`,
  POST: `POST`,
  PUT: `PUT`,
  DELETE: `DELETE`,
};

const ResponseCode = {
  SUCCESS: 200,
  REDIRECTION: 300,
};

const checkStatus = (response) => {
  if (
    response.status >= ResponseCode.SUCCESS &&
    response.status < ResponseCode.REDIRECTION
  ) {
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

  updateFilm(id, film) {
    return this._load({
      url: `1movies/${id}`,
      method: Method.PUT,
      body: JSON.stringify(film.toRAW()),
      headers: new Headers({'Content-Type': `application/json`}),
    })
      .then((response) => response.json())
      .then(Film.parseFilm);
  }

  sync(films) {
    return this._load({
      url: `movies/sync`,
      method: Method.POST,
      body: JSON.stringify(films),
      headers: new Headers({'Content-Type': `application/json`}),
    }).then((response) => response.json());
  }

  getComments(id) {
    return this._load({url: `comments/${id}`})
      .then((response) => response.json())
      .then(Comment.parseComments);
  }

  createComment(filmId, comment) {
    return this._load({
      url: `comments/${filmId}`,
      method: Method.POST,
      body: JSON.stringify(comment.toRAW()),
      headers: new Headers({'Content-Type': `application/json`}),
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
}
