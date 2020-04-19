import {createElm} from '../utils.js';

const sortingNames = [`default`, `date`, `rating`];

const createSortMarkup = (sortType, isActive) => {
  return (
    `<li><a href="#" class="sort__button ${isActive ?
      `sort__button--active` : ``}">Sort by ${sortType}</a></li>`
  );
};

const createSortingTemplate = () => {
  const sortsMarkup = sortingNames.map((v, i) => createSortMarkup(v, i === 0)).join(`\n`);

  return (
    `<ul class="sort">
      ${sortsMarkup}
    </ul>`
  );
};

export default class Sorting {
  constructor() {
    this._elm = null;
  }

  getTemplate() {
    return createSortingTemplate();
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
