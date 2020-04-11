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

const FILM_COUNT = 15;
const FILM_EXTRA_CONTAINER_COUNT = 2;
const FILM_EXTRA_COUNT = 2;
const CONTENT_EXTRA_TITLES = [`Top rated`, `Most commented`];

const headerElm = document.querySelector(`.header`);
const mainElm = document.querySelector(`.main`);
const footerElm = document.querySelector(`.footer`);

const films = generateFilms(FILM_COUNT);
// console.dir(films);

const renderTemplate = (container, template, place = `beforeend`) => {
  container.insertAdjacentHTML(place, template);
};

renderTemplate(headerElm, createProfileTemplate());
renderTemplate(mainElm, createMainNavAndSortTemplate(), `afterbegin`);
renderTemplate(mainElm, createFilmsListTemplate());

const filmsListElm = mainElm.querySelector(`.films-list`);

renderTemplate(filmsListElm, createListContainerTemplate());

const listContainerElm = filmsListElm.querySelector(`.films-list__container`);

for (let i = 0; i < FILM_COUNT; i++) {
  renderTemplate(listContainerElm, createFilmCardTemplate(films[i]));
}

renderTemplate(filmsListElm, createShowMoreBtnTemplate());

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

renderTemplate(footerElm, createStatisticTemplate());
// renderTemplate(footerElm, createDetailsPopupTemplate(films[0]), `afterend`);
