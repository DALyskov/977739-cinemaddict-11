import AbstractSmartComponent from './abstract-smart-component.js';

export const SortType = {
  DEFAULT: `default`,
  DATE: `date`,
  RATING: `rating`,
};

const createSortMarkup = (sortType, currentSortType) => {
  const isActive = (sortType === currentSortType);
  return (
    `<li><a href="#" class="sort__button ${isActive ?
      `sort__button--active` : ``}" data-sort-type='${sortType}'>Sort by ${sortType}</a></li>`
  );
};

const createSortingTemplate = (currentSortType) => {
  const sortsMarkup = Object.values(SortType).map((v) => createSortMarkup(v, currentSortType)).join(`\n`);

  return (
    `<ul class="sort">
      ${sortsMarkup}
    </ul>`
  );
};

export default class Sorting extends AbstractSmartComponent {
  constructor() {
    super();
    this._handler = null;
    this._currentSortType = SortType.DEFAULT;
  }

  recoveryListeners() {
    this._onSortElmClick(this._handler);
  }

  getTemplate() {
    return createSortingTemplate(this._currentSortType);
  }

  getSortType() {
    return this._currentSortType;
  }

  setSortTypeDefault() {
    this._currentSortType = SortType.DEFAULT;
    this.rerender();
    this._handler(/* this._currentSortType */);
  }

  setSortTypeHandler(handler) {
    this._handler = handler;
    this._onSortElmClick(this._handler);
  }

  _onSortElmClick(handler) {
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
      this.rerender();

      handler(/* this._currentSortType */);
    });
  }
}
