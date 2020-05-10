import {checkKeyCode} from '../utils/common.js';
import {RenderPosition, render, remove, replace} from '../utils/render.js';
import FilmCardComponent from '../components/film-cardr.js';
import FilmPopupComponent from '../components/film-popup.js';

const PopupStatus = {
  OPENED: `opened`,
  СLOSED: `closed`,
};

export default class MovieController {
  constructor(container, popupContainer, onDataChange, onViewChange, onCommentsDataChange) {
    this._container = container;
    this._popupContainer = popupContainer;
    this._onDataChange = onDataChange;
    this._onViewChange = onViewChange;
    this._onCommentsDataChange = onCommentsDataChange;
    this._popupStatus = PopupStatus.СLOSED;
    this._filmCardComponent = null;
    this._filmPopupComponent = null;
    this._oldFilmPopupComponent = null;
    this._film = null;
    this._filmComments = null;

    this._onFilmClick = this._onFilmClick.bind(this);
    this._onWatchlistBtnClick = this._onFilmControlClick.bind(this, `fromWatchlist`);
    this._onWatchedBtnClick = this._onFilmControlClick.bind(this, `isWatched`);
    this._onIsFavoriteBtnClick = this._onFilmControlClick.bind(this, `isFavorite`);
    this._comentDeleteBtnClickHandler = this._comentDeleteBtnClickHandler.bind(this);

    // this._openPopup = this._openPopup.bind(this);
  }

  render(film, filmComments) {
    const oldFilmComponent = this._filmCardComponent;
    this._filmCardComponent = new FilmCardComponent(film);
    this._film = film;
    this._filmComments = filmComments ? filmComments : this._filmComments;

    this._filmCardComponent.setClickHandler(this._onFilmClick);
    this._filmCardComponent.setWatchlistBtnClickHandler(this._onWatchlistBtnClick);
    this._filmCardComponent.setWatchedBtnClickHandler(this._onWatchedBtnClick);
    this._filmCardComponent.setFavoriteBtnClickHandler(this._onIsFavoriteBtnClick);

    if (oldFilmComponent) {
      replace(this._filmCardComponent, oldFilmComponent);
    } else {
      render(this._container, this._filmCardComponent);
    }
  }

  setDefaultView() {
    if (this._popupStatus !== PopupStatus.СLOSED) {
      remove(this._filmPopupComponent);
      // this._popupStatus = PopupStatus.СLOSED;
    }
  }

  destroy() {
    remove(this._filmCardComponent);
    if (this._filmPopupComponent) {
      remove(this._filmPopupComponent);
    }
  }

  _onFilmClick(evt) {
    evt.preventDefault();
    // this._onViewChange();
    const filmCardImg = this._filmCardComponent.getElm().querySelector(`.film-card__poster`);
    const filmCardTitle = this._filmCardComponent.getElm().querySelector(`.film-card__title`);
    const filmCardRating = this._filmCardComponent.getElm().querySelector(`.film-card__rating`);
    if (evt.target !== filmCardImg && evt.target !== filmCardTitle && evt.target !== filmCardRating) {
      return;
    }

    this.renderPopup();
  }

  renderPopup() {
    this._onViewChange();
    // this._oldFilmPopupComponent = this._filmPopupComponent;
    this._filmPopupComponent = new FilmPopupComponent(this._film, this._filmComments);

    const onCloseBtnClick = () => {
      remove(this._filmPopupComponent);
      document.removeEventListener(`keydown`, onEscKeydown);
      this._popupStatus = PopupStatus.СLOSED;
    };

    const onEscKeydown = (keydownEvt) => checkKeyCode(onCloseBtnClick, keydownEvt);

    this._filmPopupComponent.setCloseBtnClickHendler(onCloseBtnClick);
    document.addEventListener(`keydown`, onEscKeydown);

    this._filmPopupComponent.setWatchlistBtnClickHandler(this._onWatchlistBtnClick);
    this._filmPopupComponent.setWatchedBtnClickHandler(this._onWatchedBtnClick);
    this._filmPopupComponent.setFavoriteBtnClickHandler(this._onIsFavoriteBtnClick);

    this._filmPopupComponent.setComentDeleteBtnClickHandler(this._comentDeleteBtnClickHandler);

    render(this._popupContainer, this._filmPopupComponent, RenderPosition.AFTERBEGIN);
    this._popupStatus = PopupStatus.OPENED;
  }

  _comentDeleteBtnClickHandler(evt) {
    evt.preventDefault();
    const commentId = evt.target.dataset.commentId;

    this._onCommentsDataChange(commentId, null);

    const newFilmComments = this._film.comment.filter((comment) => comment !== commentId);


    this._onDataChange(this._film, Object.assign({}, this._film, {[`comment`]: newFilmComments}), (this._popupStatus === PopupStatus.OPENED));
  }

  _onFilmControlClick(label) {
    // console.log((this._popupStatus === PopupStatus.OPENED));
    this._onDataChange(this._film, Object.assign({}, this._film, {[label]: !this._film[label]}), (this._popupStatus === PopupStatus.OPENED));
  }
}
