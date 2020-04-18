import {createElm} from '../utils.js';

const createShowMoreBtnTemplate = () => {
  return (
    `<button class="films-list__show-more">Show more</button>`
  );
};

export default class ShowMoreBtn {
  constructor() {
    this._elm = null;
  }

  getTemplate() {
    return createShowMoreBtnTemplate();
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
