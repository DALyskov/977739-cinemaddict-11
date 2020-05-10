import {getRndArrFromArr} from '../utils/common.js';
import {render, remove, replace} from '../utils/render.js';

import FilmListComponent from '../components/films-list.js';
import ListContainerComponent from '../components/list-container.js';
import ListExtraComponent from '../components/list-extra.js';
import ShowMoreBtnComponent from '../components/show-more-btn.js';
import SortingComponent, {SortType} from '../components/sorting.js';

import MovieController from './move-controller.js';


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

const renderFilms = (container, popupContainer, films, comments, onDataChange, onViewChange, onCommentsDataChange, isListContainer = true) => {
  let listContainer = container;

  if (isListContainer) {
    const listContainerComponent = new ListContainerComponent();
    listContainer = listContainerComponent.getElm();
    render(container, listContainerComponent);
  }

  return films.map((film) => {
    const movieController = new MovieController(listContainer, popupContainer, onDataChange, onViewChange, onCommentsDataChange);
    const filmComments = film.comment.map((v) => {
      return comments.getCommentById(v);
    });
    movieController.render(film, filmComments);

    return movieController;
  });
};

export default class PageController {
  constructor(container, popupContainer, moviesModel, commentsModel) {
    this._container = container;
    this._popupContainer = popupContainer;
    this._moviesModel = moviesModel;
    this._commentsModel = commentsModel;
    this._showingFilmsCount = SHOWING_FILM_COUNT_ON_START;

    this._openedPopupFilmId = null;

    this._sortingComponent = new SortingComponent();
    this._filmsListComponent = new FilmListComponent(this._moviesModel.getFilms());
    // this._listContainerComponent = new ListContainerComponent();
    this._showMoreBtnComponent = new ShowMoreBtnComponent();

    this._showedFilmControllers = [];
    this._showedFilmControllersExtra = [];
    this._onDataChange = this._onDataChange.bind(this);
    this._onViewChange = this._onViewChange.bind(this);
    this._onFilterChange = this._onFilterChange.bind(this);
    this._onSortTypeChange = this._onSortTypeChange.bind(this);
    this._onCommentsDataChange = this._onCommentsDataChange.bind(this);
    this._updateFilms = this._updateFilms.bind(this);
    this._openPopup = this._openPopup.bind(this);

    this._moviesModel.setFilterChangeHandler(this._onFilterChange);
    this._moviesModel.setDataChangeHandler(this._updateFilms);
    this._moviesModel.setDataChangeHandler(this._openPopup);
    this._commentsModel.setDataChangeHandler(/* this._updateFilms */);
  }

  render() {
    render(this._container, this._sortingComponent);

    this._filmList = this._filmsListComponent.getElm().querySelector(`.films-list`);

    render(this._container, this._filmsListComponent);

    if (this._moviesModel.getFilms().length === 0) {
      return;
    }

    this._sortingComponent.setSortTypeHandler(this._onSortTypeChange);

    this._renderFilms(this._filmList, this._moviesModel.getFilms().slice(0, this._showingFilmsCount), this._commentsModel, this._showedFilmControllers);

    this._listContainer = this._filmList.querySelector(`.films-list__container`);

    this._renderShowMoreBtn(this._filmList);
    this._renderListExtra();
  }

  _removeFilms() {
    this._showedFilmControllers.forEach((filmController) => filmController.destroy());
    this._showedFilmControllers = [];
  }

  _renderFilms(container, films, comments, controllers, isListContainer = true) {
    const newFilms = renderFilms(container, this._popupContainer, films, comments, this._onDataChange, this._onViewChange, this._onCommentsDataChange, isListContainer);

    switch (controllers) {
      case this._showedFilmControllers:
        this._showedFilmControllers = this._showedFilmControllers.concat(newFilms);
        this._showingFilmsCount = this._showedFilmControllers.length;
        break;
      case this._showedFilmControllersExtra:
        this._showedFilmControllersExtra = this._showedFilmControllersExtra.concat(newFilms);
        break;
    }
  }

  _renderShowMoreBtn(filmsContainer) {
    remove(this._showMoreBtnComponent);

    if (this._showingFilmsCount >= this._moviesModel.getFilms().length) {
      return;
    }

    this._showMoreBtnComponent.setClickHendler(() => {
      const prevFilmsCount = this._showingFilmsCount;
      this._showingFilmsCount = this._showingFilmsCount + SHOWING_FILM_COUNT_BY_BUTTON;

      const sortedFilms = getSortedFilms(this._moviesModel.getFilms(), this._sortingComponent.getSortType(), prevFilmsCount, this._showingFilmsCount);

      this._renderFilms(this._listContainer, sortedFilms, this._commentsModel, this._showedFilmControllers, false);

      if (this._showingFilmsCount >= this._moviesModel.getFilms().length) {
        remove(this._showMoreBtnComponent);
      }
    });
    render(filmsContainer, this._showMoreBtnComponent);
  }

  _updateFilms() {
    // this._sortingComponent.setSortTypeDefault();
    // this._sortingComponent.rerender();

    // const sortedFilms = getSortedFilms(this._moviesModel.getFilms(), this._sortType, 0, this._showingFilmsCount);

    const sortedFilms = getSortedFilms(this._moviesModel.getFilms(), this._sortingComponent.getSortType(), 0, this._showingFilmsCount);

    this._removeFilms();
    this._renderFilms(
        this._listContainer,
        // this._moviesModel.getFilms().slice(0, this._showingFilmsCount),
        sortedFilms,
        this._commentsModel,
        this._showedFilmControllers,
        false);
    this._renderShowMoreBtn(this._filmList);
  }

  _renderListExtra() {
    contentExtraType.forEach((title, sortExtraType) => {
      const rndFilms = getRndArrFromArr(this._moviesModel.getFilms());
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

      this._renderFilms(listExtraComponent.getElm(), rndFilms.slice(0, FILM_EXTRA_COUNT), this._commentsModel, this._showedFilmControllersExtra);
    });
  }

  _onDataChange(oldData, newData, popupStatus) {
    // if (newData === null) {

    // }

    if (popupStatus) {
      this._openedPopupFilmId = oldData.id;
    }
    const isSuccess = this._moviesModel.updateFilm(oldData.id, newData);


    // if (isSuccess) {
    //   this._showedFilmControllers.forEach((filmController) => {
    //     if (filmController._film.id === oldData.id) {
    //       filmController.render(newData);
    //     }
    //   });

    //   this._showedFilmControllersExtra.forEach((filmController) => {
    //     if (filmController._film.id === oldData.id) {
    //       filmController.render(newData);
    //     }
    //   });
    // }
  }

  _onCommentsDataChange(oldCommentId, newComment) {
    // this._commentsModel.removeComment(oldData.id);
    if (newComment === null) {
      this._commentsModel.removeComment(oldCommentId);
    }
  }

  _openPopup() {
    this._showedFilmControllers.forEach((filmController) => {
      if (filmController._film.id === this._openedPopupFilmId) {
        filmController.renderPopup();
        this._openedPopupFilmId = null;
      }
    });

  }

  _onFilterChange() {
    this._showingFilmsCount = SHOWING_FILM_COUNT_ON_START;
    this._updateFilms();
  }

  _onSortTypeChange(sortType) {
    this._showingFilmsCount = SHOWING_FILM_COUNT_ON_START;

    // this._sortType = sortType;

    const sortedFilms = getSortedFilms(this._moviesModel.getFilms(), sortType, 0, this._showingFilmsCount);

    this._removeFilms();
    this._renderFilms(this._listContainer, sortedFilms, this._commentsModel, this._showedFilmControllers, false);
    this._renderShowMoreBtn(this._filmList);
  }

  _onViewChange() {
    this._showedFilmControllers.forEach((v) => v.setDefaultView());
  }
}
