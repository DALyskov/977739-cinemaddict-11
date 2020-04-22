import AbstractComponent from './abstract-component.js';

const createListExtraTemplate = (title) => {
  return (
    `<section class="films-list--extra">
      <h2 class="films-list__title">${title}</h2>
    </section>`
  );
};

export default class ListExtra extends AbstractComponent {
  constructor(title) {
    super();
    this._title = title;
  }

  getTemplate() {
    return createListExtraTemplate(this._title);
  }
}
