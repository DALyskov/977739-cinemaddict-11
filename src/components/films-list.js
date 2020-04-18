import {createElm} from '../utils.js';

const createFilmsListTemplate = () => {
  return (
    `<section class="films">
      <section class="films-list">
        <h2 class="films-list__title visually-hidden">All movies. Upcoming</h2>
      </section>
    </section>`
  );
};

export default class FilmList {
  constructor() {
    this._elm = null;
  }

  getTemplate() {
    return createFilmsListTemplate();
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
