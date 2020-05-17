import {checkKeyCode} from '../utils/common.js';
import {RenderPosition, render, remove, replace} from '../utils/render.js';
import FilmModel from '../models/film.js';
import CommentModel from '../models/comment.js';

import FilmCardComponent from '../components/film-cardr.js';
import FilmPopupComponent from '../components/film-popup.js';


const SHAKE_ANIMATION_TIMEOUT = 600;

const PopupStatus = {
  OPENED: `opened`,
  СLOSED: `closed`,
};

const parseFormData = (formData) => {
  return new CommentModel({
    "comment": formData.get(`comment`),
    "date": new Date().toISOString(),
    "emotion": formData.get(`comment-emoji`)
  });
};

export default class MovieController {
  constructor(container, popupContainer, onDataChange, onViewChange, onCommentsDataChange, comments, api) {
    this._container = container;
    this._popupContainer = popupContainer;
    this._onDataChange = onDataChange;
    this._onViewChange = onViewChange;
    this._onCommentsDataChange = onCommentsDataChange;
    this._commentsModel = comments;
    this._api = api;

    this._popupStatus = PopupStatus.СLOSED;
    this._filmCardComponent = null;
    this._filmPopupComponent = null;
    // this._oldFilmPopupComponent = null;
    this._film = null;
    this._filmComments = null;

    this._onFilmClick = this._onFilmClick.bind(this);
    this._onWatchlistBtnClick = this._onFilmControlClick.bind(this, `fromWatchlist`);
    this._onWatchedBtnClick = this._onFilmControlClick.bind(this, `isWatched`);
    this._onIsFavoriteBtnClick = this._onFilmControlClick.bind(this, `isFavorite`);
    this._comentDeleteBtnClickHandler = this._comentDeleteBtnClickHandler.bind(this);
    this._submitCommentHandler = this._submitCommentHandler.bind(this);
  }

  render(film) {
    const oldFilmComponent = this._filmCardComponent;
    this._filmCardComponent = new FilmCardComponent(film);
    this._film = film;
    // this._filmComments = filmComments ? filmComments : this._filmComments;

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

  shake(isDeleting) {
    const shakingElm = isDeleting ?
      this._deletingCommentElm :
      this._filmPopupComponent.getElm();

    shakingElm.style.animation = `shake ${SHAKE_ANIMATION_TIMEOUT / 1000}s`;

    // console.log(this._filmPopupComponent._newComment);

    setTimeout(() => {
      shakingElm.style.animation = ``;

      this._filmPopupComponent.setOption({
        deleteButtonText: `Delete`,
        deletingCommentId: ``,
        formAttribute: ``,
        isSubmitErr: !isDeleting,
      });
    }, SHAKE_ANIMATION_TIMEOUT);
  }

  _onFilmClick(evt) {
    evt.preventDefault();
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

    this._api.getComments(this._film.id)
      .then((comments) => {

        this._commentsModel.setComments(comments);
        this._filmComments = this._commentsModel.getComments();
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

        this._filmPopupComponent.setSubmitCommentHandler(this._submitCommentHandler);

        render(this._popupContainer, this._filmPopupComponent, RenderPosition.AFTERBEGIN);
        this._popupStatus = PopupStatus.OPENED;
      });
  }

  _comentDeleteBtnClickHandler(evt) {
    evt.preventDefault();

    const commentId = evt.target.dataset.commentId;

    this._filmPopupComponent.setOption({
      deleteButtonText: `Deleting…`,
      deletingCommentId: commentId,
    });

    this._deletingCommentElm = this._filmPopupComponent.getElm().querySelector(`[data-comment-id="${commentId}"]`).parentElement.parentElement.parentElement;

    this._onCommentsDataChange(commentId, null, this._film.id);

    // const newFilmComments = this._film.comments.filter((comment) => comment !== commentId);

    // console.log(this._film);
    // const newFilm = FilmModel.clone(this._film);
    // newFilm[`comments`] = newFilmComments;
    // console.log(newFilm);

    // this._onDataChange(this._film, newFilm, (this._popupStatus === PopupStatus.OPENED));
  }

  _submitCommentHandler(evt) {
    if ((evt.ctrlKey || evt.metaKey) && evt.key === `Enter`) {
      const formData = this._filmPopupComponent.getData();
      const data = parseFormData(formData);

      // this._filmPopupComponent._commentInput = evt.target;
      this._filmPopupComponent._newComment = evt.target.value;

      this._filmPopupComponent.setOption({
        formAttribute: `disabled`,
        isSubmitErr: false,
      });

      this._onCommentsDataChange(null, data, this._film.id);
    }
  }

  _onFilmControlClick(label) {
    const newFilm = FilmModel.clone(this._film);
    newFilm[label] = !newFilm[label];

    // this._onDataChange(this._film, Object.assign({}, this._film, {[label]: !this._film[label]}), (this._popupStatus === PopupStatus.OPENED));
    this._onDataChange(this._film, newFilm, (this._popupStatus === PopupStatus.OPENED));
  }
}
