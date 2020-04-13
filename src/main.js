import {createProfileTemplate} from './components/profile.js';
import {createMainNavAndSortTemplate} from './components/main-nav-and-sort.js';
import {createFilmsListTemplate} from './components/films-list.js';
import {createListContainerTemplate} from './components/list-container.js';
import {createFilmCardTemplate} from './components/film-cardr.js';
import {createShowMoreBtnTemplate} from './components/show-more-btn.js';
import {createListExtraTemplate} from './components/list-extra.js';
import {createStatisticTemplate} from './components/statistic.js';
import {createDetailsPopupTemplate} from './components/details-popup.js';
import {generateFilms} from './mock/film.js';
import {generateFilters, generateSorts} from './mock/filter-and-sort.js';
import {generateStat} from './mock/stat.js';

const FILM_COUNT = 15;
const SHOWING_FILM_COUNT_ON_START = 5;
const SHOWING_FILM_COUNT_BY_BUTTON = 5;
const FILM_EXTRA_CONTAINER_COUNT = 2;
const FILM_EXTRA_COUNT = 2;
const CONTENT_EXTRA_TITLES = [`Top rated`, `Most commented`];

const headerElm = document.querySelector(`.header`);
const mainElm = document.querySelector(`.main`);
const footerElm = document.querySelector(`.footer`);

const stat = generateStat();
const films = generateFilms(FILM_COUNT);
const filters = generateFilters().map((filter) => {
  Object.keys(stat).forEach((key) => {
    if (key === `${filter.name.toLowerCase()}`) {
      filter.count = stat[`${filter.name.toLowerCase()}`].size;
    }
  });
  return filter;
});

const renderTemplate = (container, template, place = `beforeend`) => {
  container.insertAdjacentHTML(place, template);
};

renderTemplate(headerElm, createProfileTemplate(stat.watchlist.size));
renderTemplate(mainElm, createMainNavAndSortTemplate(filters, generateSorts()), `afterbegin`);
renderTemplate(mainElm, createFilmsListTemplate());

const filmsListElm = mainElm.querySelector(`.films-list`);

renderTemplate(filmsListElm, createListContainerTemplate());

const listContainerElm = filmsListElm.querySelector(`.films-list__container`);

let showingFilmsCount = SHOWING_FILM_COUNT_ON_START;

films.slice(0, showingFilmsCount).forEach((film) => renderTemplate(listContainerElm, createFilmCardTemplate(film)));

renderTemplate(filmsListElm, createShowMoreBtnTemplate());

const showMoreBtn = filmsListElm.querySelector(`.films-list__show-more`);

showMoreBtn.addEventListener(`click`, () => {
  const prevFilmsCount = showingFilmsCount;
  showingFilmsCount = showingFilmsCount + SHOWING_FILM_COUNT_BY_BUTTON;

  films.slice(prevFilmsCount, showingFilmsCount)
  .forEach((film) => renderTemplate(listContainerElm, createFilmCardTemplate(film)));

  if (showingFilmsCount >= films.length) {
    showMoreBtn.remove();
  }
});

for (let i = 0; i < FILM_EXTRA_CONTAINER_COUNT; i++) {
  renderTemplate(filmsListElm, createListExtraTemplate(), `afterend`);
}

const listExtraСollection = mainElm.querySelectorAll(`.films-list--extra`);
let extraTitles = mainElm.querySelectorAll(`.films-list__title`);
extraTitles = Array.prototype.slice.call(extraTitles).slice(1);
extraTitles.forEach((v, i) => {
  v.textContent = CONTENT_EXTRA_TITLES[i];
  renderTemplate(listExtraСollection[i], createListContainerTemplate());
});

let listConteiners = mainElm.querySelectorAll(`.films-list__container`);
listConteiners = Array.prototype.slice.call(listConteiners).slice(-2);
listConteiners.forEach((v) => {
  for (let i = 0; i < FILM_EXTRA_COUNT; i++) {
    renderTemplate(v, createFilmCardTemplate(films[i]));
  }
});

renderTemplate(footerElm, createStatisticTemplate(films.length));
renderTemplate(footerElm, createDetailsPopupTemplate(films[0]), `afterend`);
