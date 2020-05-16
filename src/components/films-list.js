import AbstractComponent from './abstract-component.js';

const createFilmsListTemplate = (films) => {
  return (
    `<section class="films">
      <section class="films-list">${films.length !== 0 ?
      `<h2 class="films-list__title visually-hidden">All movies. Upcoming</h2>`
      : `<h2 class="films-list__title">There are no movies in our database</h2>`}
      </section>
    </section>`
  );
};

export default class FilmList extends AbstractComponent {
  constructor(films) {
    super();
    this._films = films;
  }
  getTemplate() {
    return createFilmsListTemplate(this._films);
  }
}
