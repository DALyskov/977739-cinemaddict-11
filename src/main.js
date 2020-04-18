import FilmCardComponent from './components/film-cardr.js';
import FilmPopupComponent from './components/film-popup.js';
import FilmListComponent from './components/films-list.js';
import FooterStatisticsComponent from './components/footer-statistics.js';
import ListContainerComponent from './components/list-container.js';
import ListExtraComponent from './components/list-extra.js';
import MainNavComponent from './components/main-nav.js';
import ProfileComponent from './components/profile.js';
import ShowMoreBtnComponent from './components/show-more-btn.js';
import SortingComponent from './components/sorting.js';

import {generateFilms} from './mock/film.js';
import {generateFilters} from './mock/filter.js';
import {generateStat} from './mock/stat.js';

import {checkKeyCode} from './utils.js';

const FILM_COUNT = 10;
const SHOWING_FILM_COUNT_ON_START = 5;
const SHOWING_FILM_COUNT_BY_BUTTON = 5;
const CONTENT_EXTRA_TITLES = [`Top rated`, `Most commented`];
const FILM_EXTRA_COUNT = 2;

const RenderPosition = {
  AFTERBEGIN: `afterbegin`,
  BEFOREEND: `beforeend`
};
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

const renderElm = (container, elm, place = `beforeend`) => {
  switch (place) {
    case RenderPosition.AFTERBEGIN:
      container.prepend(elm);
      break;
    case RenderPosition.BEFOREEND:
      container.append(elm);
      break;
  }
};

const renderFilm = (container, film) => {
  const filmCardComponent = new FilmCardComponent(film);

  const onFilmClick = (evt) => {
    const filmCardImg = filmCardComponent.getElm().querySelector(`.film-card__poster`);
    const filmCardTitle = filmCardComponent.getElm().querySelector(`.film-card__title`);
    const filmCardRating = filmCardComponent.getElm().querySelector(`.film-card__rating`);
    if (evt.target !== filmCardImg && evt.target !== filmCardTitle && evt.target !== filmCardRating) {
      return;
    }

    const filmPopupComponent = new FilmPopupComponent(film);
    const popupCloseBtn = filmPopupComponent.getElm().querySelector(`.film-details__close-btn`);

    const onCloseBtnClick = () => {
      filmPopupComponent.getElm().remove();
      filmPopupComponent.removeElm();
      document.removeEventListener(`keydown`, onEscKeydown);
    };

    const onEscKeydown = (keydownEvt) => checkKeyCode(onCloseBtnClick, keydownEvt);

    popupCloseBtn.addEventListener(`click`, onCloseBtnClick);
    document.addEventListener(`keydown`, onEscKeydown);

    renderElm(footerElm, filmPopupComponent.getElm(), RenderPosition.AFTERBEGIN);
  };

  filmCardComponent.getElm().addEventListener(`click`, onFilmClick);

  renderElm(container, filmCardComponent.getElm());
};

const renderFilms = (container, sortedFilms) => {
  const listContainerComponent = new ListContainerComponent();
  renderElm(container, listContainerComponent.getElm());

  let showingFilmsCount = SHOWING_FILM_COUNT_ON_START;

  sortedFilms.slice(0, showingFilmsCount).
  forEach((film) => renderFilm(listContainerComponent.getElm(), film));

  const showMoreBtnComponent = new ShowMoreBtnComponent();
  renderElm(filmList, showMoreBtnComponent.getElm());

  showMoreBtnComponent.getElm().addEventListener(`click`, () => {
    const prevFilmsCount = showingFilmsCount;
    showingFilmsCount = showingFilmsCount + SHOWING_FILM_COUNT_BY_BUTTON;

    sortedFilms.slice(prevFilmsCount, showingFilmsCount)
    .forEach((film) => renderFilm(listContainerComponent.getElm(), film));

    if (showingFilmsCount >= sortedFilms.length) {
      showMoreBtnComponent.getElm().remove();
      showMoreBtnComponent.removeElm();
    }
  });
};

const renderFilmsExtra = (container, sortedFilms) => {
  const listContainerComponent = new ListContainerComponent();
  renderElm(container.getElm(), listContainerComponent.getElm());

  sortedFilms.slice(0, FILM_EXTRA_COUNT).
  forEach((film) => renderFilm(listContainerComponent.getElm(), film));
};

renderElm(headerElm, new ProfileComponent(stat.watchlist.size).getElm());
renderElm(mainElm, new MainNavComponent(filters).getElm(), RenderPosition.AFTERBEGIN);
renderElm(mainElm, new SortingComponent().getElm());

const filmsListComponent = new FilmListComponent();
const filmList = filmsListComponent.getElm().querySelector(`.films-list`);
renderElm(mainElm, filmsListComponent.getElm());

// const listContainerComponent = new ListContainerComponent();
// renderElm(filmList, listContainerComponent.getElm());

// let showingFilmsCount = SHOWING_FILM_COUNT_ON_START;

// films.slice(0, showingFilmsCount).
// forEach((film) => renderFilm(listContainerComponent.getElm(), film));

// const showMoreBtnComponent = new ShowMoreBtnComponent();
// renderElm(filmList, showMoreBtnComponent.getElm());

// showMoreBtnComponent.getElm().addEventListener(`click`, () => {
//   const prevFilmsCount = showingFilmsCount;
//   showingFilmsCount = showingFilmsCount + SHOWING_FILM_COUNT_BY_BUTTON;

//   films.slice(prevFilmsCount, showingFilmsCount)
//   .forEach((film) => renderFilm(listContainerComponent.getElm(), film));

//   if (showingFilmsCount >= films.length) {
//     showMoreBtnComponent.getElm().remove();
//     showMoreBtnComponent.removeElm();
//   }
// });
renderFilms(filmList, films);

CONTENT_EXTRA_TITLES.forEach((title) => {
  const listExtraComponent = new ListExtraComponent(title);
  renderElm(filmsListComponent.getElm(), listExtraComponent.getElm());
  // const listContainerExtraComponent = new ListContainerComponent();
  // renderElm(listExtraComponent.getElm(), listContainerExtraComponent.getElm());

  // for (let i = 0; i < FILM_EXTRA_COUNT; i++) {
  //   renderFilm(listContainerExtraComponent.getElm(), films[i]);
  // }
  renderFilmsExtra(listExtraComponent, films);
});

renderElm(footerElm, new FooterStatisticsComponent(FILM_COUNT).getElm());
