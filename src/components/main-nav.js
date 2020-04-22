import AbstractComponent from './abstract-component.js';

const createFilterMarkup = (filter) => {
  const {name, count} = filter;
  return (
    `<a href="#${name}" class="main-navigation__item">${name} <span class="main-navigation__item-count">${count}</span></a>`
  );
};

const createMainNavTemplate = (filters) => {
  const firstfilterName = filters[0].name;
  const filtersMarkup = filters.slice(1).map((v) => createFilterMarkup(v)).join(`\n`);

  return (
    `<nav class="main-navigation">
      <div class="main-navigation__items">
        <a href="#all" class="main-navigation__item main-navigation__item--active">${firstfilterName}</a>
        ${filtersMarkup}
      </div>
      <a href="#stats" class="main-navigation__additional">Stats</a>
    </nav>`
  );
};

export default class MainNav extends AbstractComponent {
  constructor(filters) {
    super();
    this._filters = filters;
  }

  getTemplate() {
    return createMainNavTemplate(this._filters);
  }
}
