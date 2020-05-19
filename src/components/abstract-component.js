import {createElm} from '../utils/render.js';

const HIDDEN_CLASS = `visually-hidden`;

export default class AbstractComponent {
  constructor() {
    if (new.target === AbstractComponent) {
      throw new Error(`Can't instantiate AbstractComponent, only concrete one.`);
    }
    this._elm = null;
  }
  getTemplate() {
    throw new Error(`Abstract method not implemented: getTemplate`);
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

  show() {
    if (this._elm) {
      this._elm.classList.remove(HIDDEN_CLASS);
    }
  }

  hide() {
    if (this._elm) {
      this._elm.classList.add(HIDDEN_CLASS);
    }
  }
}
