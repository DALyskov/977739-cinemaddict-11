import {createElm} from '../utils.js';

const createListExtraTemplate = () => {
  return (
    `<section class="films-list--extra">
      <h2 class="films-list__title"></h2>
    </section>`
  );
};

export default class ListExtra {
  constructor() {
    this._elm = null;
  }

  getTemplate() {
    return createListExtraTemplate();
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
