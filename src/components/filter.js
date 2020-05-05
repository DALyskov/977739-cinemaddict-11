// import getFilmByFilter from '../utils/filter.js';
import AbstractComponent from './abstract-component.js';

const createFilterMarkup = (filter, isFirstItem) => {
  const {name, count, checked: isChecked} = filter;
  const modifier = isChecked ? `main-navigation__item--active` : ``;
  return (
    `<a href="#${name}" class="main-navigation__item ${modifier}" data-filter-type='${name}'>${name}
    ${isFirstItem ?
      `<span class="main-navigation__item-count">${count}</span>`
      : ``}</a>`
  );
};

const createMainNavTemplate = (filters) => {
  // const firstfilterName = filters[0].name;
  const filtersMarkup = filters.slice(0).map((v, i) => createFilterMarkup(v, i)).join(`\n`);

  return (
    `<nav class="main-navigation">
      <div class="main-navigation__items">
        ${filtersMarkup}
      </div>
      <a href="#stats" class="main-navigation__additional">Stats</a>
    </nav>`
  );
};

export default class Filter extends AbstractComponent {
  constructor(filters) {
    super();
    this._filters = filters;
  }

  getTemplate() {
    return createMainNavTemplate(this._filters);
  }

  setFilterChangeHandler(handler) {
    this.getElm().addEventListener(`click`, (evt) => {
      evt.preventDefault();
      if (evt.target.classList[0] !== `main-navigation__item`) {
        return;
      }
      // const filterName = getFilterNameById(evt.target.dataset.filterType);
      handler(evt.target.dataset.filterType);
    });
  }
}
