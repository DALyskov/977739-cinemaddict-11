import {getRndArrFromArr, checkKeyCode} from '../utils/common.js';
import {RenderPosition, render, remove} from '../utils/render.js';
import FilmCardComponent from '../components/film-cardr.js';
import FilmPopupComponent from '../components/film-popup.js';
import FilmListComponent from '../components/films-list.js';
import ListContainerComponent from '../components/list-container.js';
import ListExtraComponent from '../components/list-extra.js';
import ShowMoreBtnComponent from '../components/show-more-btn.js';
import SortingComponent from '../components/sorting.js';


const SHOWING_FILM_COUNT_ON_START = 5;
const SHOWING_FILM_COUNT_BY_BUTTON = 5;
const FILM_EXTRA_COUNT = 2;

const constentExtraType = new Map([
  [`rating`, `Top rated`],
  [`coments`, `Most commented`]
]);

const renderFilm = (container, popupContainer, film) => {
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

    render(popupContainer, filmPopupComponent, RenderPosition.AFTERBEGIN);
  };

  filmCardComponent.setClickHandler(onFilmClick);

  render(container, filmCardComponent);
};

const renderFilms = (container, popupContainer, sortedFilms, showingFilmsCount) => {
  const listContainerComponent = new ListContainerComponent();
  render(container, listContainerComponent);

  sortedFilms.slice(0, showingFilmsCount).
  forEach((film) => renderFilm(listContainerComponent.getElm(), popupContainer, film));
};

export default class PageController {
  constructor(container, popupContainer, films) {
    this._container = container;
    this._popupContainer = popupContainer;
    this._films = films;

    this._sortingComponent = new SortingComponent();
    this._filmsListComponent = new FilmListComponent(this._films);
    this._showMoreBtnComponent = new ShowMoreBtnComponent();
  }

  render() {
    let showingFilmsCount = SHOWING_FILM_COUNT_ON_START;

    render(this._container, this._sortingComponent);
    const filmList = this._filmsListComponent.getElm().querySelector(`.films-list`);

    render(this._container, this._filmsListComponent);

    if (this._films.length === 0) {
      return;
    }

    renderFilms(filmList, this._popupContainer, this._films, showingFilmsCount);
    const listContainer = filmList.querySelector(`.films-list__container`);

    this._showMoreBtnComponent.setClickHendler(() => {
      const prevFilmsCount = showingFilmsCount;
      showingFilmsCount = showingFilmsCount + SHOWING_FILM_COUNT_BY_BUTTON;

      this._films.slice(prevFilmsCount, showingFilmsCount)
      .forEach((film) => renderFilm(listContainer, this._popupContainer, film));

      if (showingFilmsCount >= this._films.length) {
        remove(this._showMoreBtnComponent);
      }
    });
    render(filmList, this._showMoreBtnComponent);

    constentExtraType.forEach((title, sortingType) => {
      const listExtraComponent = new ListExtraComponent(title);
      render(this._filmsListComponent.getElm(), listExtraComponent);

      const newFilms = getRndArrFromArr(this._films);
      newFilms.sort((a, b) => {
        a = a[sortingType].length || a[sortingType];
        b = b[sortingType].length || b[sortingType];
        return b - a;
      });

      renderFilms(listExtraComponent.getElm(), this._popupContainer, newFilms, FILM_EXTRA_COUNT);
    });
  }
}
