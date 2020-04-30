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
    this._oldFilmPopupComponent = null;
    this._film = null;
  }

  render(film) {
    const oldFilmComponent = this._filmCardComponent;
    this._filmCardComponent = new FilmCardComponent(film);
    this._film = film;
    console.dir(this._onViewChange);
    // const onFilmClick = (evt) => {
    //   evt.preventDefault();
    //   this._onViewChange();
    //   const filmCardImg = this._filmCardComponent.getElm().querySelector(`.film-card__poster`);
    //   const filmCardTitle = this._filmCardComponent.getElm().querySelector(`.film-card__title`);
    //   const filmCardRating = this._filmCardComponent.getElm().querySelector(`.film-card__rating`);
    //   if (evt.target !== filmCardImg && evt.target !== filmCardTitle && evt.target !== filmCardRating) {
    //     return;
    //   }

    //   this._oldFilmPopupComponent = this._filmPopupComponent;
    //   this._filmPopupComponent = new FilmPopupComponent(film);
    //   // const filmPopupComponent = this._filmPopupComponent;
    //   // const filmPopupComponent = new FilmPopupComponent(film);

    //   const onCloseBtnClick = () => {
    //     remove(this._filmPopupComponent);
    //     document.removeEventListener(`keydown`, onEscKeydown);
    //   };

    //   const onEscKeydown = (keydownEvt) => checkKeyCode(onCloseBtnClick, keydownEvt);

    //   this._filmPopupComponent.setCloseBtnClickHendler(onCloseBtnClick);
    //   document.addEventListener(`keydown`, onEscKeydown);

    //   this._filmPopupComponent.setWatchlistBtnClickHandler(() => {
    //     this._onDataChange(film, Object.assign({}, film, {fromWatchlist: !film.fromWatchlist}));
    //   });

    //   this._filmPopupComponent.setWatchedBtnClickHandler(() => {
    //     this._onDataChange(film, Object.assign({}, film, {isWatched: !film.isWatched}));
    //   });

    //   this._filmPopupComponent.setFavoriteBtnClickHandler(() => {
    //     this._onDataChange(film, Object.assign({}, film, {isFavorite: !film.isFavorite}));
    //   });

    //   render(this._popupContainer, this._filmPopupComponent, RenderPosition.AFTERBEGIN);
    //   this._popupStatus = PopupStatus.OPENED;
    // };

    this._filmCardComponent.setClickHandler(this._onFilmClick);

    this._filmCardComponent.setWatchlistBtnClickHandler(() => {
      this._onDataChange(film, Object.assign({}, film, {fromWatchlist: !film.fromWatchlist}));
    });

    this._filmCardComponent.setWatchedBtnClickHandler(() => {
      this._onDataChange(film, Object.assign({}, film, {isWatched: !film.isWatched}));
    });

    this._filmCardComponent.setFavoriteBtnClickHandler(() => {
      this._onDataChange(film, Object.assign({}, film, {isFavorite: !film.isFavorite}));
    });
    // && this._oldFilmPopupComponent
    if (oldFilmComponent) {
      replace(this._filmCardComponent, oldFilmComponent);
      // replace(this._filmPopupComponent, this._oldFilmPopupComponent);
    } else {
      render(this._container, this._filmCardComponent);
    }
  }

  _onFilmClick(evt) {
    evt.preventDefault();
    console.dir(this._onViewChange);
    console.dir(this._filmCardComponent);
    console.dir(this);

    // this._onViewChange();
    const filmCardImg = this._filmCardComponent.getElm().querySelector(`.film-card__poster`);
    const filmCardTitle = this._filmCardComponent.getElm().querySelector(`.film-card__title`);
    const filmCardRating = this._filmCardComponent.getElm().querySelector(`.film-card__rating`);
    if (evt.target !== filmCardImg && evt.target !== filmCardTitle && evt.target !== filmCardRating) {
      return;
    }

    this._oldFilmPopupComponent = this._filmPopupComponent;
    this._filmPopupComponent = new FilmPopupComponent(this._film);
    // const filmPopupComponent = this._filmPopupComponent;
    // const filmPopupComponent = new FilmPopupComponent(film);

    const onCloseBtnClick = () => {
      remove(this._filmPopupComponent);
      document.removeEventListener(`keydown`, onEscKeydown);
    };

    const onEscKeydown = (keydownEvt) => checkKeyCode(onCloseBtnClick, keydownEvt);

    this._filmPopupComponent.setCloseBtnClickHendler(onCloseBtnClick);
    document.addEventListener(`keydown`, onEscKeydown);

    this._filmPopupComponent.setWatchlistBtnClickHandler(() => {
      this._onDataChange(this._film, Object.assign({}, this._film, {fromWatchlist: !this._film.fromWatchlist}));
    });

    this._filmPopupComponent.setWatchedBtnClickHandler(() => {
      this._onDataChange(this._film, Object.assign({}, this._film, {isWatched: !this._film.isWatched}));
    });

    this._filmPopupComponent.setFavoriteBtnClickHandler(() => {
      this._onDataChange(this._film, Object.assign({}, this._film, {isFavorite: !this._film.isFavorite}));
    });

    render(this._popupContainer, this._filmPopupComponent, RenderPosition.AFTERBEGIN);
    this._popupStatus = PopupStatus.OPENED;
  }

  setDefaultView() {
    if (this._popupStatus !== PopupStatus.СLOSED) {
      remove(this._filmPopupComponent);
    }
  }
}
