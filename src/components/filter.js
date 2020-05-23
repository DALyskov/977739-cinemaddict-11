import AbstractComponent from './abstract-component.js';
import {MENU_ITEM_STATS} from '../const.js';

const createFilterMarkup = (filter, isFirstItem) => {
  const {name, count, checked: isChecked} = filter;
  const modifier = isChecked ? `main-navigation__item--active` : ``;
  return `<a href="#${name}" class="main-navigation__item ${modifier}" data-filter-type='${name}'>${name}
    ${
  isFirstItem
    ? `<span class="main-navigation__item-count">${count}</span>`
    : ``
}</a>`;
};

const createMainNavTemplate = (filters, activeFilterType) => {
  const filtersMarkup = filters
    .slice(0)
    .map((v, i) => createFilterMarkup(v, i))
    .join(`\n`);

  const modifier =
    activeFilterType === MENU_ITEM_STATS ? `main-navigation__item--active` : ``;
  return `<nav class="main-navigation">
      <div class="main-navigation__items">
        ${filtersMarkup}
      </div>
      <a href="#stats" class="main-navigation__additional ${modifier}" data-filter-type="${MENU_ITEM_STATS}">Stats</a>
    </nav>`;
};

export default class Filter extends AbstractComponent {
  constructor(filters, activeFilterType) {
    super();
    this._filters = filters;
    this._activeFilterType = activeFilterType;
  }

  getTemplate() {
    return createMainNavTemplate(this._filters, this._activeFilterType);
  }

  setFilterChangeHandler(handler) {
    let menuItems = this.getElm().querySelectorAll(`.main-navigation__item`);
    const menuItemStats = this.getElm().querySelector(
        `.main-navigation__additional`
    );
    menuItems = Array.prototype.concat(Array.from(menuItems), menuItemStats);

    menuItems.forEach((item) => {
      item.addEventListener(`click`, (evt) => {
        evt.preventDefault();
        handler(evt.currentTarget.dataset.filterType);
      });
    });
  }
}
