import AbstractComponent from './abstract-component.js';

const createLoadingTemplate = () => {
  return (
    `<h2 class="films-list__title">Loading...</h2>`
  );
};

export default class Loading extends AbstractComponent {
  constructor(films) {
    super();
    this._films = films;
  }
  getTemplate() {
    return createLoadingTemplate(this._films);
  }
}
