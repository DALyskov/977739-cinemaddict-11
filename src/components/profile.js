import {getRank} from '../utils/common.js';
import AbstractComponent from './abstract-component.js';

const createProfileTemplate = (watchlistSize) => {
  const rank = getRank(watchlistSize);

  return (
    `<section class="header__profile profile">
      <p class="profile__rating">${rank}</p>
      <img class="profile__avatar" src="images/bitmap@2x.png" alt="Avatar" width="35" height="35">
    </section>`
  );
};

export default class Profile extends AbstractComponent {
  constructor(watchlistSize) {
    super();
    this._watchlistSize = watchlistSize;
  }

  getTemplate() {
    return createProfileTemplate(this._watchlistSize);
  }
}
