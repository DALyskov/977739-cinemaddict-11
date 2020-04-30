import {checkKeyCode} from '../utils/common.js';
import {RenderPosition, render, remove, replace} from '../utils/render.js';
import FilmCardComponent from '../components/film-cardr.js';
import FilmPopupComponent from '../components/film-popup.js';

const PopupStatus = {
  OPENED: `opened`,
  СLOSED: `closed`,
};

export default class MoveController {
  constructor(container, popupContainer, onDataChange, onViewChange) {
    this._container = container;
    this._popupContainer = popupContainer;
    this._onDataChange = onDataChange;
    this._onViewChange = onViewChange;
    this._popupStatus = PopupStatus.СLOSED;
    this._filmCardComponent = null;
    this._filmPopupComponent = null;
    // this._oldFilmPopupComponent = null;
    this._film = null;

    this._onFilmClick = this._onFilmClick.bind(this);
    this._onWatchlistBtnClick = this._onFilmControlClick.bind(this, `fromWatchlist`);
    this._onWatchedBtnClick = this._onFilmControlClick.bind(this, `isWatched`);
    this._onisFavoriteBtnClick = this._onFilmControlClick.bind(this, `isFavorite`);
  }

  render(film) {
    const oldFilmComponent = this._filmCardComponent;
    this._filmCardComponent = new FilmCardComponent(film);
    this._film = film;

    this._filmCardComponent.setClickHandler(this._onFilmClick);

    this._filmCardComponent.setWatchlistBtnClickHandler(this._onWatchlistBtnClick);
    this._filmCardComponent.setWatchedBtnClickHandler(this._onWatchedBtnClick);
    this._filmCardComponent.setFavoriteBtnClickHandler(this._onisFavoriteBtnClick);

    if (oldFilmComponent) {
      replace(this._filmCardComponent, oldFilmComponent);
    } else {
      render(this._container, this._filmCardComponent);
    }
  }

  _onFilmClick(evt) {
    evt.preventDefault();
    this._onViewChange();
    const filmCardImg = this._filmCardComponent.getElm().querySelector(`.film-card__poster`);
    const filmCardTitle = this._filmCardComponent.getElm().querySelector(`.film-card__title`);
    const filmCardRating = this._filmCardComponent.getElm().querySelector(`.film-card__rating`);
    if (evt.target !== filmCardImg && evt.target !== filmCardTitle && evt.target !== filmCardRating) {
      return;
    }

    // this._oldFilmPopupComponent = this._filmPopupComponent;
    this._filmPopupComponent = new FilmPopupComponent(this._film);

    const onCloseBtnClick = () => {
      remove(this._filmPopupComponent);
      document.removeEventListener(`keydown`, onEscKeydown);
    };

    const onEscKeydown = (keydownEvt) => checkKeyCode(onCloseBtnClick, keydownEvt);

    this._filmPopupComponent.setCloseBtnClickHendler(onCloseBtnClick);
    document.addEventListener(`keydown`, onEscKeydown);

    this._filmPopupComponent.setWatchlistBtnClickHandler(this._onWatchlistBtnClick);
    this._filmPopupComponent.setWatchedBtnClickHandler(this._onWatchedBtnClick);
    this._filmPopupComponent.setFavoriteBtnClickHandler(this._onisFavoriteBtnClick);

    render(this._popupContainer, this._filmPopupComponent, RenderPosition.AFTERBEGIN);
    this._popupStatus = PopupStatus.OPENED;
  }

  _onFilmControlClick(label) {
    this._onDataChange(this._film, Object.assign({}, this._film, {[label]: !this._film[label]}));
  }

  setDefaultView() {
    if (this._popupStatus !== PopupStatus.СLOSED) {
      remove(this._filmPopupComponent);
    }
  }
}
