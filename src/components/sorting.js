import AbstractComponent from './abstract-component.js';

export const SortType = {
  DEFAULT: `default`,
  DATE: `date`,
  RATING: `rating`,
};

const createSortMarkup = (sortType, isActive) => {
  return (
    `<li><a href="#" class="sort__button ${isActive ?
      `sort__button--active` : ``}" data-sort-type='${sortType}'>Sort by ${sortType}</a></li>`
  );
};

const createSortingTemplate = () => {
  const sortsMarkup = Object.values(SortType).map((v, i) => createSortMarkup(v, i === 0)).join(`\n`);

  return (
    `<ul class="sort">
      ${sortsMarkup}
    </ul>`
  );
};

export default class Sorting extends AbstractComponent {
  constructor() {
    super();
    this._currentSortType = SortType.DEFAULT;
  }

  getTemplate() {
    return createSortingTemplate();
  }

  getSortType() {
    return this._currentSortType;
  }

  setSortTypeHangeHandler(handler) {
    this.getElm().addEventListener(`click`, (evt) => {
      evt.preventDefault();
      if (evt.target.tagName !== `A`) {
        return;
      }

      const newSortType = evt.target.dataset.sortType;

      if (newSortType === this._currentSortType) {
        return;
      }

      this._currentSortType = newSortType;
      handler(this._currentSortType);
    });
  }
}
