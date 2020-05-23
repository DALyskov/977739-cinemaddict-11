import AbstractSmartComponent from './abstract-smart-component.js';

export const SortType = {
  DEFAULT: `default`,
  DATE: `date`,
  RATING: `rating`,
};

const createSortMarkup = (sortType, currentSortType) => {
  const isActive = sortType === currentSortType;
  return `<li><a href="#" class="sort__button ${
    isActive ? `sort__button--active` : ``
  }" data-sort-type='${sortType}'>Sort by ${sortType}</a></li>`;
};

const createSortingTemplate = (currentSortType) => {
  const sortsMarkup = Object.values(SortType)
    .map((sortType) => createSortMarkup(sortType, currentSortType))
    .join(`\n`);

  return `<ul class="sort">
      ${sortsMarkup}
    </ul>`;
};

export default class Sorting extends AbstractSmartComponent {
  constructor() {
    super();
    this._onSortTypeChange = null;
    this._currentSortType = SortType.DEFAULT;
  }

  getTemplate() {
    return createSortingTemplate(this._currentSortType);
  }

  recoveryListeners() {
    this.setSortTypeChangeHandler(this._onSortTypeChange);
  }

  getSortType() {
    return this._currentSortType;
  }

  setSortTypeDefault() {
    this._currentSortType = SortType.DEFAULT;
    this.rerender();
    this._onSortTypeChange();
  }

  setSortTypeChangeHandler(handler) {
    this._onSortTypeChange = handler;

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

      this._onSortTypeChange();
    });
  }
}
