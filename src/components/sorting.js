import AbstractComponent from './abstract-component.js';

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

export default class Sorting extends AbstractComponent {

  getTemplate() {
    return createSortingTemplate();
  }
}
