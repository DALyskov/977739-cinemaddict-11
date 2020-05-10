import AbstractComponent from './abstract-component.js';
import {formatDuration, formatReleaseDate} from '../utils/common.js';

const createFilmCardTemplate = (film) => {
  const {title, genres, poster, description, rating, duration: durationMinute, releaseDate, comment, fromWatchlist, isWatched, isFavorite} = film;

  const genre = genres[0];
  const releaseYear = formatReleaseDate(releaseDate);
  const commentsCount = comment.length;
  const duration = formatDuration(durationMinute);

  let reducedDescription = description;
  if (description.length > 140) {
    reducedDescription = description.slice(0, 139).concat(`\u{2026}`);
  }

  const fromWatchlistActivClass = fromWatchlist ? `film-card__controls-item--active` : ``;
  const isWatchedActivClass = isWatched ? `film-card__controls-item--active` : ``;
  const isFavoriteActivClass = isFavorite ? `film-card__controls-item--active` : ``;

  return (
    `<article class="film-card">
      <h3 class="film-card__title">${title}</h3>
      <p class="film-card__rating">${rating}</p>
      <p class="film-card__info">
        <span class="film-card__year">${releaseYear}</span>
        <span class="film-card__duration">${duration}</span>
        <span class="film-card__genre">${genre}</span>
      </p>
      <img src="./images/posters/${poster}" alt="${title}" class="film-card__poster">
      <p class="film-card__description">${reducedDescription}</p>
      <a class="film-card__comments">${commentsCount} comments</a>
      <form class="film-card__controls">
        <button class="film-card__controls-item button film-card__controls-item--add-to-watchlist ${fromWatchlistActivClass}">Add to watchlist</button>
        <button class="film-card__controls-item button film-card__controls-item--mark-as-watched ${isWatchedActivClass}">Mark as watched</button>
        <button class="film-card__controls-item button film-card__controls-item--favorite ${isFavoriteActivClass}">Mark as favorite</button>
      </form>
    </article>`
  );
};

export default class FilmCard extends AbstractComponent {
  constructor(film) {
    super();
    this._film = film;
  }

  getTemplate() {
    return createFilmCardTemplate(this._film);
  }

  setClickHandler(handler) {
    this.getElm().addEventListener(`click`, handler);
  }

  setWatchlistBtnClickHandler(handler) {
    this.getElm().querySelector(`.film-card__controls-item--add-to-watchlist`)
      .addEventListener(`click`, handler);
  }

  setWatchedBtnClickHandler(handler) {
    this.getElm().querySelector(`.film-card__controls-item--mark-as-watched`)
      .addEventListener(`click`, handler);
  }

  setFavoriteBtnClickHandler(handler) {
    this.getElm().querySelector(`.film-card__controls-item--favorite`)
      .addEventListener(`click`, handler);
  }
}
