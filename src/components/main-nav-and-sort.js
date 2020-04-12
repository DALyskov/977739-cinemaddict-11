const createFilterMarkup = (filter) => {
  const {name, count} = filter;
  return (
    `<a href="#${name}" class="main-navigation__item">${name} <span class="main-navigation__item-count">${count}</span></a>`
  );
};

const createSortMarkup = (sort, isActive) => {
  return (
    `<li><a href="#" class="sort__button ${
      isActive ?
        `sort__button--active`
        : ``
    }">Sort by ${sort.name}</a></li>`
  );
};

const createMainNavAndSortTemplate = (filters, sorts) => {
  const firstfilterName = filters[0].name;
  const filtersMarkup = filters.slice(1).map((v) => createFilterMarkup(v)).join(`\n`);
  const sortsMarkup = sorts.map((v, i) => createSortMarkup(v, i === 0)).join(`\n`);

  return (
    `<nav class="main-navigation">
      <div class="main-navigation__items">
        <a href="#all" class="main-navigation__item main-navigation__item--active">${firstfilterName}</a>
        ${filtersMarkup}
      </div>
      <a href="#stats" class="main-navigation__additional">Stats</a>
    </nav>
    <ul class="sort">
      ${sortsMarkup}
    </ul>`
  );
};

export {createMainNavAndSortTemplate};
