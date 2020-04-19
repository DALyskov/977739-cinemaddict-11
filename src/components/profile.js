import {createElm} from '../utils.js';

const ranckProfileListDict = {
  0: `Novice`,
  10: `Fan`,
  20: `Movie Buff`,
};

const createProfileTemplate = (watchlistSize) => {
  let rank = ``;
  Object.keys(ranckProfileListDict).forEach((key) => {
    if (watchlistSize > key) {
      rank = ranckProfileListDict[key];
    }
  });

  return (
    `<section class="header__profile profile">
      <p class="profile__rating">${rank}</p>
      <img class="profile__avatar" src="images/bitmap@2x.png" alt="Avatar" width="35" height="35">
    </section>`
  );
};

export default class Profile {
  constructor(watchlistSize) {
    this._watchlistSize = watchlistSize;
    this._elm = null;
  }

  getTemplate() {
    return createProfileTemplate(this._watchlistSize);
  }

  getElm() {
    if (!this._elm) {
      this._elm = createElm(this.getTemplate());
    }
    return this._elm;
  }

  removeElm() {
    this._elm = null;
  }
}
