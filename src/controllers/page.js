import {getRndArrFromArr} from '../utils/common.js';
import {render, remove} from '../utils/render.js';

import FilmListComponent from '../components/films-list.js';
import ListContainerComponent from '../components/list-container.js';
import ListExtraComponent from '../components/list-extra.js';
import ShowMoreBtnComponent from '../components/show-more-btn.js';
import SortingComponent, {SortType} from '../components/sorting.js';

import MoveController from './move-controller.js';


const SHOWING_FILM_COUNT_ON_START = 5;
const SHOWING_FILM_COUNT_BY_BUTTON = 5;
const FILM_EXTRA_COUNT = 2;

const contentExtraType = new Map([
  [`rating`, `Top rated`],
  [`coments`, `Most commented`]
]);

const getSortedFilms = (films, sortType, from, to) => {
  let sortedFilms = [];
  const showingFilms = films.slice();

  switch (sortType) {
    case SortType.DATE:
      sortedFilms = showingFilms.sort((a, b) => b.releaseDate - a.releaseDate);
      break;
    case SortType.RATING:
      sortedFilms = showingFilms.sort((a, b) => b.rating - a.rating);
      break;
    case SortType.DEFAULT:
      sortedFilms = showingFilms;
      break;
  }

  return sortedFilms.slice(from, to);
};

const renderFilms = (container, popupContainer, sortedFilms, onDataChange, onViewChange, isListContainer = true) => {
  let listContainer = container;

  // Возможно стоит вынести это как отдельную функцию
  if (isListContainer) {
    const listContainerComponent = new ListContainerComponent();
    listContainer = listContainerComponent.getElm();
    render(container, listContainerComponent);
  }

  return sortedFilms.map((film) => {
    const moveController = new MoveController(listContainer, popupContainer, onDataChange, onViewChange);
    moveController.render(film);

    return moveController;
  });
};

export default class PageController {
  constructor(container, popupContainer, films) {
    this._container = container;
    this._popupContainer = popupContainer;
    this._films = films;
    this._showingFilmsCount = SHOWING_FILM_COUNT_ON_START;

    this._sortingComponent = new SortingComponent();
    this._filmsListComponent = new FilmListComponent(this._films);
    this._showMoreBtnComponent = new ShowMoreBtnComponent();

    this._showedFilmControllers = [];
    this._onDataChange = this._onDataChange.bind(this);
    this._onViewChange = this._onViewChange.bind(this);
  }

  render() {
    render(this._container, this._sortingComponent);


    const filmList = this._filmsListComponent.getElm().querySelector(`.films-list`);

    render(this._container, this._filmsListComponent);

    if (this._films.length === 0) {
      return;
    }

    this._sortingComponent.setSortTypeHangeHandler((sortType) => {
      const sortedFilms = getSortedFilms(this._films, sortType, 0, this._showingFilmsCount);

      filmList.innerHTML = ``;

      const newFilms = renderFilms(filmList, this._popupContainer, sortedFilms, this._onDataChange, this._onViewChange);
      this._showedFilmControllers = this._showedFilmControllers.concat(newFilms);

      this._renderShowMoreBtn(filmList);
    });

    const newFilms = renderFilms(filmList, this._popupContainer, this._films.slice(0, this._showingFilmsCount), this._onDataChange, this._onViewChange);
    this._showedFilmControllers = this._showedFilmControllers.concat(newFilms);

    this._renderShowMoreBtn(filmList);
    this._renderListExtra();
  }

  _renderShowMoreBtn(container) {
    remove(this._showMoreBtnComponent);

    if (this._showingFilmsCount >= this._films.length) {
      return;
    }

    const listContainer = container.querySelector(`.films-list__container`);

    this._showMoreBtnComponent.setClickHendler(() => {
      const prevFilmsCount = this._showingFilmsCount;
      this._showingFilmsCount = this._showingFilmsCount + SHOWING_FILM_COUNT_BY_BUTTON;

      const sortedFilms = getSortedFilms(this._films, this._sortingComponent.getSortType(), prevFilmsCount, this._showingFilmsCount);

      const newFilms = renderFilms(listContainer, this._popupContainer, sortedFilms, this._onDataChange, this._onViewChange, false);
      this._showedFilmControllers = this._showedFilmControllers.concat(newFilms);

      if (this._showingFilmsCount >= this._films.length) {
        remove(this._showMoreBtnComponent);
      }
    });
    render(container, this._showMoreBtnComponent);
  }

  _renderListExtra() {
    contentExtraType.forEach((title, sortExtraType) => {
      const rndFilms = getRndArrFromArr(this._films);
      rndFilms.sort((a, b) => {
        a = a[sortExtraType].length || a[sortExtraType];
        b = b[sortExtraType].length || b[sortExtraType];
        return b - a;
      });

      if (rndFilms[0][sortExtraType].length === 0 || rndFilms[0][sortExtraType] === 0) {
        return;
      }

      const listExtraComponent = new ListExtraComponent(title);
      render(this._filmsListComponent.getElm(), listExtraComponent);

      const newFilms = renderFilms(listExtraComponent.getElm(), this._popupContainer, rndFilms.slice(0, FILM_EXTRA_COUNT), this._onDataChange, this._onViewChange);
      this._showedFilmControllers = this._showedFilmControllers.concat(newFilms);
    });
  }

  _onDataChange(oldData, newData) {
    const index = this._films.findIndex((v) => v === oldData);

    if (index === -1) {
      return;
    }

    this._films = [].concat(this._films.slice(0, index), newData, this._films.slice(index + 1));

    this._showedFilmControllers[index].render(this._films[index]);
  }

  _onViewChange() {
    this._showedFilmControllers.forEach((v) => v.setDefaultView());
  }
}
