import {createElm} from '../utils.js';

const createListContainerTemplate = () => {
  return (
    `<div class="films-list__container"></div>`
  );
};

export default class ListContainer {
  constructor() {
    this._elm = null;
  }

  getTemplate() {
    return createListContainerTemplate();
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
