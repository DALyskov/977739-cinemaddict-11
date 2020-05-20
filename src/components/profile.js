import {getRank} from '../utils/common.js';
import AbstractSmartComponent from './abstract-smart-component';

const createProfileTemplate = (watchlistSize) => {
  const rank = getRank(watchlistSize);

  return (
    `<section class="header__profile profile">
      <p class="profile__rating">${rank}</p>
      <img class="profile__avatar" src="images/bitmap@2x.png" alt="Avatar" width="35" height="35">
    </section>`
  );
};

export default class Profile extends AbstractSmartComponent {
  constructor(moviesModel) {
    super();
    this._moviesModel = moviesModel;

    this.rerender = this.rerender.bind(this);
    this._moviesModel.setDataChangeHandler(this.rerender);
  }

  getTemplate() {
    return createProfileTemplate(this._moviesModel.getWatchedFilms().length);
  }

  recoveryListeners() {}
}
