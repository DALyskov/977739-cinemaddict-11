import AbstractComponent from './abstract-component.js';

const createFilmsListTemplate = (isfilms) => {
  return `<section class="films">
      <section class="films-list">${
  isfilms
    ? `<h2 class="films-list__title visually-hidden">All movies. Upcoming</h2>`
    : `<h2 class="films-list__title">There are no movies in our database</h2>`
}
      </section>
    </section>`;
};

export default class FilmList extends AbstractComponent {
  constructor(isfilms) {
    super();
    this._isfilms = isfilms;
  }
  getTemplate() {
    return createFilmsListTemplate(this._isfilms);
  }
}
