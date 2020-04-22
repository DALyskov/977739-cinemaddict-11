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
import PageController from './controllers/page.js';
import {generateFilms} from './mock/film.js';
import {generateFilters} from './mock/filter.js';
import {generateStat} from './mock/stat.js';
import {getRndArrFromArr, checkKeyCode} from './utils/common.js';
import {RenderPosition, render, remove} from './utils/render.js';

const FILM_COUNT = 10;
const SHOWING_FILM_COUNT_ON_START = 5;
const SHOWING_FILM_COUNT_BY_BUTTON = 5;
const FILM_EXTRA_COUNT = 2;

const headerElm = document.querySelector(`.header`);
const mainElm = document.querySelector(`.main`);
const footerElm = document.querySelector(`.footer`);

const constentExtraType = new Map([
  [`rating`, `Top rated`],
  [`coments`, `Most commented`]
]);

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

const renderFilm = (container, film) => {
  const filmCardComponent = new FilmCardComponent(film);

  const onFilmClick = (evt) => {
    evt.preventDefault();
    const filmCardImg = filmCardComponent.getElm().querySelector(`.film-card__poster`);
    const filmCardTitle = filmCardComponent.getElm().querySelector(`.film-card__title`);
    const filmCardRating = filmCardComponent.getElm().querySelector(`.film-card__rating`);
    if (evt.target !== filmCardImg && evt.target !== filmCardTitle && evt.target !== filmCardRating) {
      return;
    }

    const filmPopupComponent = new FilmPopupComponent(film);

    const onCloseBtnClick = () => {
      remove(filmPopupComponent);
      document.removeEventListener(`keydown`, onEscKeydown);
    };

    const onEscKeydown = (keydownEvt) => checkKeyCode(onCloseBtnClick, keydownEvt);

    filmPopupComponent.setCloseBtnClickHendler(onCloseBtnClick);
    document.addEventListener(`keydown`, onEscKeydown);

    render(footerElm, filmPopupComponent, RenderPosition.AFTERBEGIN);
  };

  filmCardComponent.setClickHandler(onFilmClick);

  render(container, filmCardComponent);
};

const renderFilms = (container, sortedFilms) => {
  const listContainerComponent = new ListContainerComponent();
  render(container, listContainerComponent);

  let showingFilmsCount = SHOWING_FILM_COUNT_ON_START;

  sortedFilms.slice(0, showingFilmsCount).
  forEach((film) => renderFilm(listContainerComponent.getElm(), film));

  const showMoreBtnComponent = new ShowMoreBtnComponent();
  render(filmList, showMoreBtnComponent);

  showMoreBtnComponent.setClickHendler(() => {
    const prevFilmsCount = showingFilmsCount;
    showingFilmsCount = showingFilmsCount + SHOWING_FILM_COUNT_BY_BUTTON;

    sortedFilms.slice(prevFilmsCount, showingFilmsCount)
    .forEach((film) => renderFilm(listContainerComponent.getElm(), film));

    if (showingFilmsCount >= sortedFilms.length) {
      remove(showMoreBtnComponent);
    }
  });
};

const renderFilmsExtra = (container, sortedFilms) => {
  const listContainerComponent = new ListContainerComponent();
  render(container.getElm(), listContainerComponent);

  sortedFilms.slice(0, FILM_EXTRA_COUNT).
  forEach((film) => renderFilm(listContainerComponent.getElm(), film));
};

render(headerElm, new ProfileComponent(stat.watchlist.size));
render(mainElm, new MainNavComponent(filters), RenderPosition.AFTERBEGIN);
render(mainElm, new SortingComponent());

const filmsListComponent = new FilmListComponent();
const filmList = filmsListComponent.getElm().querySelector(`.films-list`);
render(mainElm, filmsListComponent);

renderFilms(filmList, films);

constentExtraType.forEach((title, sortingType) => {
  const listExtraComponent = new ListExtraComponent(title);
  render(filmsListComponent.getElm(), listExtraComponent);

  const newFilms = getRndArrFromArr(films);
  newFilms.sort((a, b) => {
    a = a[sortingType].length || a[sortingType];
    b = b[sortingType].length || b[sortingType];
    return b - a;
  });

  renderFilmsExtra(listExtraComponent, newFilms);
});

render(footerElm, new FooterStatisticsComponent(FILM_COUNT));
