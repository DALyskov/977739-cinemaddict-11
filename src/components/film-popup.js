import {
  formatDuration,
  formatReleaseDate,
  formatCommentDate,
} from '../utils/date.js';
import AbstractSmartComponent from './abstract-smart-component.js';
import {encode} from 'he';

const EmotionType = {
  SMILE: `smile`,
  SLEEPING: `sleeping`,
  PUKE: `puke`,
  ANGRY: `angry`,
};

const DefaultOption = {
  DELETE_BUTTON_TEXT: `Delete`,
  DELETING_COMMENT_ID: ``,
  FORM_ATTRIBUTE: ``,
  IS_SUBMIT_ERR: false,
};

const createGanre = (genres) => {
  return genres
    .map((genre) => {
      return `<span class="film-details__genre">${genre}</span>`;
    })
    .join(`\n`);
};

const createComments = (comments, externalOption) => {
  return comments
    .map((comment) => {
      const {
        author,
        emotion,
        date,
        content: notSanitizedСontent,
        id,
      } = comment;

      const content = encode(notSanitizedСontent);
      const commentDate = formatCommentDate(date);

      let deleteButtonText = DefaultOption.DELETE_BUTTON_TEXT;
      let btnAttribute = ``;

      if (externalOption.isOnline) {
        if (externalOption.deletingCommentId === id) {
          deleteButtonText = externalOption.deleteButtonText;
          btnAttribute = `disabled`;
        }
      } else {
        btnAttribute = `disabled`;
      }

      return `<li class="film-details__comment">
          <span class="film-details__comment-emoji">
            <img src="./images/emoji/${emotion}.png" width="55" height="55" alt="emoji-${emotion}">
          </span>
          <div>
            <p class="film-details__comment-text">${content}</p>
            <p class="film-details__comment-info">
              <span class="film-details__comment-author">${author}</span>
              <span class="film-details__comment-day">${commentDate}</span>
              <button class="film-details__comment-delete" data-comment-id='${id}' ${btnAttribute}>${deleteButtonText}</button>
            </p>
          </div>
        </li>`;
    })
    .join(`\n`);
};

const createFilmPopupTemplate = (film, comments, isComments, options = {}) => {
  const {
    title,
    genres,
    poster,
    description,
    rating,
    duration: durationMinute,
    releaseDate,
    originTitle,
    director,
    writers,
    actors,
    country,
    ageRating,
    fromWatchlist,
    isWatched,
    isFavorite,
  } = film;
  const {
    newEmotionImg,
    newEmotionValue,
    newComment,
    externalOption,
  } = options;

  const duration = formatDuration(durationMinute);

  const releaseDateString = formatReleaseDate(releaseDate, true);

  const writer = writers.join(`, `);
  const actor = actors.join(`, `);
  const genresMarkup = createGanre(genres);
  const commentsErr =
    isComments && externalOption.isOnline ? `` : `Failed to update comments`;
  const comentsMarkup = createComments(comments, externalOption);
  const commentsCount = comments.length;
  const disablingAttribute = externalOption.isOnline
    ? externalOption.formAttribute
    : `disabled`;
  const inputStyle = externalOption.isSubmitErr
    ? `style="border: 2px solid red"`
    : ``;

  const fromWatchlistActivClass = fromWatchlist ? `checked` : ``;
  const isWatchedActivClass = isWatched ? `checked` : ``;
  const isFavoriteActivClass = isFavorite ? `checked` : ``;

  const checkedSmile = newEmotionValue === EmotionType.SMILE ? `checked` : ``;
  const checkedSleeping =
    newEmotionValue === EmotionType.SLEEPING ? `checked` : ``;
  const checkedPuke = newEmotionValue === EmotionType.PUKE ? `checked` : ``;
  const checkedAngry = newEmotionValue === EmotionType.ANGRY ? `checked` : ``;

  return `<section class="film-details">
      <form class="film-details__inner" action="" method="get">
        <div class="form-details__top-container">
          <div class="film-details__close">
            <button class="film-details__close-btn" type="button">close</button>
          </div>
          <div class="film-details__info-wrap">
            <div class="film-details__poster">
              <img class="film-details__poster-img" src="${poster}" alt="${title}">

              <p class="film-details__age">${ageRating}</p>
            </div>

            <div class="film-details__info">
              <div class="film-details__info-head">
                <div class="film-details__title-wrap">
                  <h3 class="film-details__title">${title}</h3>
                  <p class="film-details__title-original">Original: ${originTitle}</p>
                </div>

                <div class="film-details__rating">
                  <p class="film-details__total-rating">${rating}</p>
                </div>
              </div>

              <table class="film-details__table">
                <tr class="film-details__row">
                  <td class="film-details__term">Director</td>
                  <td class="film-details__cell">${director}</td>
                </tr>
                <tr class="film-details__row">
                  <td class="film-details__term">Writer${
  writer.length > 1 ? `s` : ``
}
                  </td>
                  <td class="film-details__cell">${writer}</td>
                </tr>
                <tr class="film-details__row">
                  <td class="film-details__term">Actors</td>
                  <td class="film-details__cell">${actor}</td>
                </tr>
                <tr class="film-details__row">
                  <td class="film-details__term">Release Date</td>
                  <td class="film-details__cell">${releaseDateString}</td>
                </tr>
                <tr class="film-details__row">
                  <td class="film-details__term">Runtime</td>
                  <td class="film-details__cell">${duration}</td>
                </tr>
                <tr class="film-details__row">
                  <td class="film-details__term">Country</td>
                  <td class="film-details__cell">${country}</td>
                </tr>
                <tr class="film-details__row">
                  <td class="film-details__term">Genre${
  genres.length > 1 ? `s` : ``
}
                  </td>
                  <td class="film-details__cell">
                    ${genresMarkup}
                  </td>
                </tr>
              </table>

              <p class="film-details__film-description">
                ${description}
              </p>
            </div>
          </div>

          <section class="film-details__controls">
            <input type="checkbox" class="film-details__control-input visually-hidden" id="watchlist" name="watchlist" ${fromWatchlistActivClass}>
            <label for="watchlist" class="film-details__control-label film-details__control-label--watchlist">Add to watchlist</label>

            <input type="checkbox" class="film-details__control-input visually-hidden" id="watched" name="watched" ${isWatchedActivClass}>
            <label for="watched" class="film-details__control-label film-details__control-label--watched">Already watched</label>

            <input type="checkbox" class="film-details__control-input visually-hidden" id="favorite" name="favorite" ${isFavoriteActivClass}>
            <label for="favorite" class="film-details__control-label film-details__control-label--favorite">Add to favorites</label>
          </section>
        </div>

        <div class="form-details__bottom-container">
          <section class="film-details__comments-wrap">
          ${
  isComments && externalOption.isOnline
    ? `<h3 class="film-details__comments-title">Comments <span class="film-details__comments-count">${commentsCount}</span></h3>`
    : `<h3 class="film-details__comments-title">${commentsErr}</h3>`
}
            <ul class="film-details__comments-list">
            ${comentsMarkup}
            </ul>

            <div class="film-details__new-comment">
              <div for="add-emoji" class="film-details__add-emoji-label">${newEmotionImg}</div>

              <label class="film-details__comment-label">
                <textarea class="film-details__comment-input" placeholder="Select reaction below and write comment here" name="comment" ${inputStyle} ${disablingAttribute}>${newComment}</textarea>
              </label>

              <div class="film-details__emoji-list">
                <input class="film-details__emoji-item visually-hidden" name="comment-emoji" type="radio" id="emoji-smile" value="smile" ${checkedSmile}>
                <label class="film-details__emoji-label" for="emoji-smile">
                  <img src="./images/emoji/smile.png" width="30" height="30" alt="emoji">
                </label>

                <input class="film-details__emoji-item visually-hidden" name="comment-emoji" type="radio" id="emoji-sleeping" value="sleeping" ${checkedSleeping}>
                <label class="film-details__emoji-label" for="emoji-sleeping">
                  <img src="./images/emoji/sleeping.png" width="30" height="30" alt="emoji">
                </label>

                <input class="film-details__emoji-item visually-hidden" name="comment-emoji" type="radio" id="emoji-puke" value="puke" ${checkedPuke}>
                <label class="film-details__emoji-label" for="emoji-puke">
                  <img src="./images/emoji/puke.png" width="30" height="30" alt="emoji">
                </label>

                <input class="film-details__emoji-item visually-hidden" name="comment-emoji" type="radio" id="emoji-angry" value="angry" ${checkedAngry}>
                <label class="film-details__emoji-label" for="emoji-angry">
                  <img src="./images/emoji/angry.png" width="30" height="30" alt="emoji">
                </label>
              </div>
            </div>
          </section>
        </div>
      </form>
    </section>`;
};

export default class FilmPopup extends AbstractSmartComponent {
  constructor(film, filmComments, isComments) {
    super();
    this._film = film;
    this._filmComments = filmComments;
    this._isComments = isComments;

    this._newEmotionImg = ``;
    this._newEmotionValue = ``;
    this._newComment = ``;
    this._externalOption = {
      deleteButtonText: DefaultOption.DELETE_BUTTON_TEXT,
      deletingCommentId: DefaultOption.DELETING_COMMENT_ID,
      formAttribute: DefaultOption.FORM_ATTRIBUTE,
      isSubmitErr: DefaultOption.IS_SUBMIT_ERR,
      isOnline: window.navigator.onLine,
    };

    this._setEmojiClickHandler();
    this._setOnlineChangeHandler();
  }

  getTemplate() {
    return createFilmPopupTemplate(
        this._film,
        this._filmComments,
        this._isComments,
        {
          newEmotionImg: this._newEmotionImg,
          newEmotionValue: this._newEmotionValue,
          newComment: this._newComment,
          externalOption: this._externalOption,
        }
    );
  }

  recoveryListeners() {
    this.setCloseBtnClickHendler(this._onCloseBtnClickHendler);
    this.setComentDeleteBtnClickHandler(this._onComentDeleteBtnClick);
    this.setSubmitCommentHandler(this._onSubmitComment);
    this.setWatchlistBtnClickHandler(this._onWatchlistBtnClic);
    this.setWatchedBtnClickHandler(this._onWatchedBtnClick);
    this.setFavoriteBtnClickHandler(this._onFavoriteBtnClick);
    this._setEmojiClickHandler();
    this._setOnlineChangeHandler();
  }

  rerender() {
    this.getElm();
    const scrollTop = this._elm.scrollTop;
    super.rerender();
    this._elm.scrollTop = scrollTop;
  }

  setData(film, filmComments = this._filmComments) {
    this._film = film;
    this._filmComments = filmComments;
  }

  getData() {
    const form = this.getElm().querySelector(`.film-details__inner`);
    return new FormData(form);
  }

  setIsCommentsOption(value) {
    this._isComments = value;
  }

  setOption(newOption, newCommentOption = false) {
    this._externalOption.deleteButtonText = DefaultOption.DELETE_BUTTON_TEXT;
    this._externalOption.deletingCommentId = DefaultOption.DELETING_COMMENT_ID;
    this._externalOption.formAttribute = DefaultOption.FORM_ATTRIBUTE;
    this._externalOption.isSubmitErr = DefaultOption.IS_SUBMIT_ERR;
    this._externalOption = Object.assign(this._externalOption, newOption);

    if (newCommentOption) {
      this._newEmotionImg = ``;
      this._newEmotionValue = ``;
      this._newComment = ``;
    }
    this.rerender();
  }

  setCommentsStatus(newStatus) {
    this._isComments = newStatus;
  }

  setCloseBtnClickHendler(handler) {
    this.getElm()
      .querySelector(`.film-details__close-btn`)
      .addEventListener(`click`, handler);
    this._onCloseBtnClickHendler = handler;
  }

  setWatchlistBtnClickHandler(handler) {
    this.getElm()
      .querySelector(`.film-details__control-label--watchlist`)
      .addEventListener(`click`, handler);
    this._onWatchlistBtnClic = handler;
  }

  setWatchedBtnClickHandler(handler) {
    this.getElm()
      .querySelector(`.film-details__control-label--watched`)
      .addEventListener(`click`, handler);
    this._onWatchedBtnClick = handler;
  }

  setFavoriteBtnClickHandler(handler) {
    this.getElm()
      .querySelector(`.film-details__control-label--favorite`)
      .addEventListener(`click`, handler);
    this._onFavoriteBtnClick = handler;
  }

  setComentDeleteBtnClickHandler(handler) {
    this.getElm()
      .querySelectorAll(`.film-details__comment-delete`)
      .forEach((btn) => {
        btn.addEventListener(`click`, handler);
        this._onComentDeleteBtnClick = handler;
      });
  }

  setSubmitCommentHandler(handler) {
    const inputElm = this.getElm().querySelector(
        `.film-details__comment-input`
    );

    inputElm.addEventListener(`keydown`, handler);
    this._onSubmitComment = handler;
  }

  _setEmojiClickHandler() {
    const elm = this.getElm();
    const inputElm = elm.querySelector(`.film-details__comment-input`);

    elm.querySelectorAll(`.film-details__emoji-label`).forEach((emoji) => {
      emoji.addEventListener(`click`, () => {
        const newEmotionImg = emoji.children[0];
        newEmotionImg.width = 55;
        newEmotionImg.height = 55;

        this._newEmotionImg = newEmotionImg.outerHTML;
        this._newEmotionValue = emoji.htmlFor.slice(`emoji-`.length);
        this._newComment = inputElm.value;
        this.rerender();
      });
    });
  }

  _setOnlineChangeHandler() {
    window.addEventListener(`online`, () => {
      this._externalOption.isOnline = window.navigator.onLine;
    });
    window.addEventListener(`offline`, () => {
      this._externalOption.isOnline = window.navigator.onLine;
    });
  }
}
