import {ShakingElm} from '../const.js';
import {checkKeyCode} from '../utils/common.js';
import {RenderPosition, render, remove, replace} from '../utils/render.js';

import CommentModel from '../models/comment.js';
import FilmModel from '../models/film.js';

import FilmCardComponent from '../components/film-cardr.js';
import FilmPopupComponent from '../components/film-popup.js';

const SHAKE_ANIMATION_TIMEOUT = 600;

const PopupStatus = {
  OPENED: `opened`,
  СLOSED: `closed`,
};

const parseFormData = (formData) => {
  return new CommentModel({
    comment: formData.get(`comment`),
    date: new Date().toISOString(),
    emotion: formData.get(`comment-emoji`),
  });
};

export default class FilmController {
  constructor(
      container,
      popupContainer,
      onFilmsDataChange,
      onViewChange,
      onCommentsDataChange,
      comments,
      api,
      filmsModel
  ) {
    this._container = container;
    this._popupContainer = popupContainer;
    this._onFilmsDataChange = onFilmsDataChange;
    this._onViewChange = onViewChange;
    this._onCommentsDataChange = onCommentsDataChange;
    this._commentsModel = comments;
    this._api = api;
    this._filmsModel = filmsModel;

    this._filmComments = [];
    this._popupStatus = PopupStatus.СLOSED;

    this._onFilmClick = this._onFilmClick.bind(this);
    this._onWatchlistBtnClick = this._onFilmControlClick.bind(
        this,
        `fromWatchlist`
    );
    this._onWatchedBtnClick = this._onFilmControlClick.bind(this, `isWatched`);
    this._onIsFavoriteBtnClick = this._onFilmControlClick.bind(
        this,
        `isFavorite`
    );
    this._onComentDeleteBtnClick = this._onComentDeleteBtnClick.bind(this);
    this._onSubmitComment = this._onSubmitComment.bind(this);

    this._onCloseBtnClick = this._onCloseBtnClick.bind(this);
    this._onEscKeydown = this._onEscKeydown.bind(this);

    this.rerenderPopup = this.rerenderPopup.bind(this);
  }

  render(film) {
    const oldFilmComponent = this._filmCardComponent;
    this._filmCardComponent = new FilmCardComponent(film);
    this._film = film;
    this._filmCardComponent.setClickHandler(this._onFilmClick);
    this._filmCardComponent.setWatchlistBtnClickHandler(
        this._onWatchlistBtnClick
    );
    this._filmCardComponent.setWatchedBtnClickHandler(this._onWatchedBtnClick);
    this._filmCardComponent.setFavoriteBtnClickHandler(
        this._onIsFavoriteBtnClick
    );

    if (oldFilmComponent) {
      replace(this._filmCardComponent, oldFilmComponent);
    } else {
      render(this._container, this._filmCardComponent);
    }
  }

  destroy() {
    remove(this._filmCardComponent);
    if (this._filmPopupComponent) {
      remove(this._filmPopupComponent);
    }
  }

  rerenderPopup(isShaking = false) {
    let changedFilm = this._filmsModel.getChangedFilm();
    if (changedFilm.id !== this._film.id) {
      changedFilm = null;
    }

    const film = this._filmsModel.getChangedFilm() || this._film;
    this._film = film;
    this._api
      .getComments(this._film.id)
      .then((comments) => {
        this._filmPopupComponent.setData(film, comments);
        this._filmPopupComponent.setCommentsStatus(true);
        this._filmPopupComponent.setOption(
            {
              formAttribute: ``,
            },
            true
        );
        if (isShaking) {
          this.shake(ShakingElm.POPUP);
        }
      })
      .catch(() => {
        this.shake(ShakingElm.POPUP);
      });
  }

  setDefaultView() {
    if (this._popupStatus !== PopupStatus.СLOSED) {
      remove(this._filmPopupComponent);
    }
  }

  shake(elm) {
    let shakingElm = null;
    let isSubmitErr = false;
    switch (elm) {
      case ShakingElm.POPUP:
        shakingElm = this._filmPopupComponent.getElm();
        break;
      case ShakingElm.COMMENT:
        shakingElm = this._deletingCommentElm;
        break;
      case ShakingElm.NEW_COMMENT:
        shakingElm = this._filmPopupComponent.getElm();
        isSubmitErr = true;
        break;
    }

    shakingElm.style.animation = `shake ${SHAKE_ANIMATION_TIMEOUT / 1000}s`;
    setTimeout(() => {
      shakingElm.style.animation = ``;

      this._filmPopupComponent.setOption({
        deleteButtonText: `Delete`,
        deletingCommentId: ``,
        formAttribute: ``,
        isSubmitErr,
      });
    }, SHAKE_ANIMATION_TIMEOUT);
  }

  _createPopup(comments, isComments = true) {
    this._commentsModel.setComments(comments);
    this._filmComments = this._commentsModel.getComments();
    this._filmPopupComponent = new FilmPopupComponent(
        this._film,
        this._filmComments,
        isComments
    );

    this._filmPopupComponent.setCloseBtnClickHendler(this._onCloseBtnClick);
    document.addEventListener(`keydown`, this._onEscKeydown);
    this._filmPopupComponent.setWatchlistBtnClickHandler(
        this._onWatchlistBtnClick
    );
    this._filmPopupComponent.setWatchedBtnClickHandler(this._onWatchedBtnClick);
    this._filmPopupComponent.setFavoriteBtnClickHandler(
        this._onIsFavoriteBtnClick
    );
    this._filmPopupComponent.setComentDeleteBtnClickHandler(
        this._onComentDeleteBtnClick
    );
    this._filmPopupComponent.setSubmitCommentHandler(this._onSubmitComment);
    this._filmsModel.setDataChangeHandler(this.rerenderPopup);

    // window.addEventListener(`offline`, (evt) => {
    //   console.log(evt);
    //   this._filmPopupComponent.setOption({
    //     isOnline: false,
    //   });
    // });

    const setPopupOnlineOption = () => {
      // this._filmPopupComponent.setOption({
      //   isOnline: window.navigator.onLine,
      // });
      if (this._popupStatus === PopupStatus.OPENED) {
        if (window.navigator.onLine) {
          // this._filmPopupComponent.setIsCommentsOption(true);
          // console.log(`run`, this._film.rating);

          this._filmsModel.setChangedFilm(this._film);
          this.rerenderPopup();
          return;
        }
        // console.log(`run2`);
        this._filmPopupComponent.rerender();
      }
    };

    window.addEventListener(`offline`, setPopupOnlineOption);
    window.addEventListener(`online`, setPopupOnlineOption);

    render(
        this._popupContainer,
        this._filmPopupComponent,
        RenderPosition.AFTERBEGIN
    );
    this._popupStatus = PopupStatus.OPENED;

    // if (!isOnline) {
    //   this._filmPopupComponent.setOption({
    //     isOnline: false,
    //   });
    // }
    // console.log(this._filmPopupComponent._externalOption);
  }

  _renderPopup() {
    this._onViewChange();

    this._api
      .getComments(this._film.id)
      .then((comments) => {
        this._createPopup(comments, true);
      })
      .catch(() => {
        this._createPopup(this._filmComments, false);
      });
  }

  _onFilmClick(evt) {
    evt.preventDefault();
    const filmCardImg = this._filmCardComponent
      .getElm()
      .querySelector(`.film-card__poster`);
    const filmCardTitle = this._filmCardComponent
      .getElm()
      .querySelector(`.film-card__title`);
    const filmCardRating = this._filmCardComponent
      .getElm()
      .querySelector(`.film-card__rating`);
    if (
      evt.target !== filmCardImg &&
      evt.target !== filmCardTitle &&
      evt.target !== filmCardRating
    ) {
      return;
    }

    this._renderPopup();
  }

  _onComentDeleteBtnClick(evt) {
    evt.preventDefault();

    const commentId = evt.target.dataset.commentId;

    this._filmPopupComponent.setOption({
      deleteButtonText: `Deleting…`,
      deletingCommentId: commentId,
    });

    this._deletingCommentElm = this._filmPopupComponent
      .getElm()
      .querySelector(
          `[data-comment-id="${commentId}"]`
      ).parentElement.parentElement.parentElement;

    this._onCommentsDataChange(commentId, null, this._film.id, this);
  }

  _onSubmitComment(evt) {
    if ((evt.ctrlKey || evt.metaKey) && evt.key === `Enter`) {
      const formData = this._filmPopupComponent.getData();
      const data = parseFormData(formData);

      this._filmPopupComponent._newComment = evt.target.value;

      this._filmPopupComponent.setOption({
        formAttribute: `disabled`,
        isSubmitErr: false,
      });

      this._onCommentsDataChange(null, data, this._film.id, this);
    }
  }

  _onFilmControlClick(label) {
    const newFilm = FilmModel.clone(this._film);
    newFilm[label] = !newFilm[label];

    this._onFilmsDataChange(
        this._film,
        newFilm,
        this._popupStatus === PopupStatus.OPENED,
        this
    );
  }

  _onCloseBtnClick() {
    remove(this._filmPopupComponent);
    this._filmsModel.removeDataChangeHandler(this.rerenderPopup);
    document.removeEventListener(`keydown`, this._onEscKeydown);
    this._popupStatus = PopupStatus.СLOSED;
  }

  _onEscKeydown(keydownEvt) {
    checkKeyCode(this._onCloseBtnClick, keydownEvt);
  }
}
