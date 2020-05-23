import {ShakingElm} from '../const.js';
import {getRndArrFromArr} from '../utils/common.js';
import {render, remove, RenderPosition} from '../utils/render.js';

import FilmListComponent from '../components/films-list.js';
import ListContainerComponent from '../components/list-container.js';
import ListExtraComponent from '../components/list-extra.js';
import LoadingComponent from '../components/loading.js';
import LoadingErrComponent from '../components/loading-err.js';
import ShowMoreBtnComponent from '../components/show-more-btn.js';
import SortingComponent, {SortType} from '../components/sorting.js';

import FilmController from './film.js';

const SHOWING_FILM_COUNT_ON_START = 5;
const SHOWING_FILM_COUNT_BY_BUTTON = 5;
const FILM_EXTRA_COUNT = 2;

const contentExtraTypes = new Map([
  [`rating`, `Top rated`],
  [`comments`, `Most commented`],
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

const renderFilms = (
    container,
    popupContainer,
    films,
    comments,
    onFilmsDataChange,
    onViewChange,
    onCommentsDataChange,
    api,
    filmsModel,
    isListContainer = true
) => {
  let listContainer = container;

  if (isListContainer) {
    const listContainerComponent = new ListContainerComponent();
    listContainer = listContainerComponent.getElm();
    render(container, listContainerComponent);
  }

  return films.map((film) => {
    const filmController = new FilmController(
        listContainer,
        popupContainer,
        onFilmsDataChange,
        onViewChange,
        onCommentsDataChange,
        comments,
        api,
        filmsModel
    );

    filmController.render(film);
    return filmController;
  });
};

export default class PageController {
  constructor(container, popupContainer, filmsModel, commentsModel, api) {
    this._container = container;
    this._popupContainer = popupContainer;
    this._filmsModel = filmsModel;
    this._commentsModel = commentsModel;
    this._api = api;
    this._showingFilmsCount = SHOWING_FILM_COUNT_ON_START;

    this._filmsListComponent = null;
    this._openedPopupFilmId = null;

    this._sortingComponent = new SortingComponent();
    this._loadingComponent = new LoadingComponent();
    this._loadingErrComponent = new LoadingErrComponent();
    this._showMoreBtnComponent = new ShowMoreBtnComponent();

    this._listExtraComponents = [];
    this._showedFilmControllers = [];
    this._showedFilmExtraControllers = [];
    this._oldShowedFilmControllers = [];
    this._oldShowedFilmControllersExtra = [];

    this._onFilmsDataChange = this._onFilmsDataChange.bind(this);
    this._onViewChange = this._onViewChange.bind(this);
    this._onFilterChange = this._onFilterChange.bind(this);
    this._onSortTypeChange = this._onSortTypeChange.bind(this);
    this._onCommentsDataChange = this._onCommentsDataChange.bind(this);
    this._updateFilms = this._updateFilms.bind(this);

    this._filmsModel.setFilterChangeHandler(this._onFilterChange);
    this._filmsModel.setDataChangeHandler(this._updateFilms);
  }

  hide() {
    this._sortingComponent.hide();
    this._filmsListComponent.hide();
  }

  show() {
    this._sortingComponent.setSortTypeDefault();
    this._sortingComponent.show();
    this._filmsListComponent.show();
  }

  render(isLoadedData) {
    let isfilms = true;
    if (isLoadedData) {
      isfilms = this._filmsModel.getFilmsAll().length !== 0 ? true : false;
    }
    this._filmsListComponent = new FilmListComponent(isfilms);
    this._filmList = this._filmsListComponent
      .getElm()
      .querySelector(`.films-list`);

    render(this._container, this._sortingComponent);
    render(this._container, this._filmsListComponent);
    render(this._filmList, this._loadingComponent, RenderPosition.AFTERBEGIN);

    this._sortingComponent.setSortTypeChangeHandler(this._onSortTypeChange);

    if (this._filmsModel.getFilms().length === 0) {
      remove(this._loadingComponent);
      return;
    }

    this._renderFilms(
        this._filmList,
        this._filmsModel.getFilms().slice(0, this._showingFilmsCount),
        this._commentsModel,
        this._showedFilmControllers
    );
    this._listContainer = this._filmList.querySelector(
        `.films-list__container`
    );

    this._renderShowMoreBtn(this._filmList);
    this._renderListExtra();
  }

  _removeFilms() {
    this._showedFilmControllers.forEach((filmController) => {
      if (this.changingFilmcontroller === filmController) {
        filmController._filmCardComponent.getElm().remove();
        return;
      }
      filmController.destroy();
    });
    this._showedFilmControllers = [];
    this._showedFilmExtraControllers.forEach((filmController) => {
      if (this.changingFilmcontroller === filmController) {
        filmController._filmCardComponent.getElm().remove();
        return;
      }
      filmController.destroy();
    });
    this._showedFilmExtraControllers = [];
  }

  _renderFilms(
      container,
      films,
      comments,
      controllers,
      isListContainer = true
  ) {
    const newFilms = renderFilms(
        container,
        this._popupContainer,
        films,
        comments,
        this._onFilmsDataChange,
        this._onViewChange,
        this._onCommentsDataChange,
        this._api,
        this._filmsModel,
        isListContainer
    );
    switch (controllers) {
      case this._showedFilmControllers:
        this._showedFilmControllers = this._showedFilmControllers.concat(
            newFilms
        );
        this._showingFilmsCount = this._showedFilmControllers.length;
        break;
      case this._showedFilmExtraControllers:
        this._showedFilmExtraControllers = this._showedFilmExtraControllers.concat(
            newFilms
        );
        break;
    }
  }

  _renderListExtra() {
    if (this._filmsModel.getFilmsAll().length === 0) {
      return;
    }
    if (this._listExtraComponents.length !== 0) {
      this._listExtraComponents.forEach((component) => remove(component));
    }
    contentExtraTypes.forEach((title, sortExtraType) => {
      const rndFilms = getRndArrFromArr(this._filmsModel.getFilmsAll());
      rndFilms.sort((a, b) => {
        a = a[sortExtraType].length || a[sortExtraType];
        b = b[sortExtraType].length || b[sortExtraType];
        return b - a;
      });

      if (
        rndFilms[0][sortExtraType].length === 0 ||
        rndFilms[0][sortExtraType] === 0
      ) {
        return;
      }

      const listExtraComponent = new ListExtraComponent(title);
      this._listExtraComponents.push(listExtraComponent);
      render(this._filmsListComponent.getElm(), listExtraComponent);

      this._renderFilms(
          listExtraComponent.getElm(),
          rndFilms.slice(0, FILM_EXTRA_COUNT),
          this._commentsModel,
          this._showedFilmExtraControllers
      );
    });
  }

  _renderShowMoreBtn(filmsContainer) {
    remove(this._loadingComponent);
    remove(this._showMoreBtnComponent);

    if (this._showingFilmsCount >= this._filmsModel.getFilms().length) {
      return;
    }

    this._showMoreBtnComponent.setClickHendler(() => {
      const prevFilmsCount = this._showingFilmsCount;
      this._showingFilmsCount =
        this._showingFilmsCount + SHOWING_FILM_COUNT_BY_BUTTON;

      const sortedFilms = getSortedFilms(
          this._filmsModel.getFilms(),
          this._sortingComponent.getSortType(),
          prevFilmsCount,
          this._showingFilmsCount
      );

      this._renderFilms(
          this._listContainer,
          sortedFilms,
          this._commentsModel,
          this._showedFilmControllers,
          false
      );

      if (this._showingFilmsCount >= this._filmsModel.getFilms().length) {
        remove(this._showMoreBtnComponent);
      }
    });
    render(filmsContainer, this._showMoreBtnComponent);
  }

  renderErr() {
    render(
        this._filmList,
        this._loadingErrComponent,
        RenderPosition.AFTERBEGIN
    );
    setTimeout(remove, 5000, this._loadingErrComponent);
  }

  _updateFilms() {
    if (this._filmsListComponent === null) {
      return;
    }
    const sortedFilms = getSortedFilms(
        this._filmsModel.getFilms(),
        this._sortingComponent.getSortType(),
        0,
        this._showingFilmsCount
    );
    this._removeFilms();
    this._renderFilms(
        this._listContainer,
        sortedFilms,
        this._commentsModel,
        this._showedFilmControllers,
        false
    );
    this._renderShowMoreBtn(this._filmList);
    this._renderListExtra();
  }

  _onFilmsDataChange(oldData, newData, popupStatus, controller) {
    if (popupStatus) {
      this._openedPopupFilmId = oldData.id;
      this.changingFilmcontroller = controller;
    }

    this._oldShowedFilmControllers = this._showedFilmControllers.slice();
    this._oldShowedFilmControllersExtra = this._showedFilmExtraControllers.slice();

    this._removeFilms();
    remove(this._showMoreBtnComponent);
    this._listExtraComponents.forEach((component) => remove(component));
    render(this._filmList, this._loadingComponent, RenderPosition.AFTERBEGIN);

    this._api
      .updateFilm(oldData.id, newData)
      .then((filmModel) => {
        this._filmsModel.updateFilm(oldData.id, filmModel);
      })
      .catch(() => {
        this._showedFilmControllers = this._oldShowedFilmControllers.slice();
        this._showedFilmExtraControllers = this._oldShowedFilmControllersExtra.slice();
        this._oldShowedFilmControllers = [];
        this._oldShowedFilmControllersExtra = [];
        this.renderErr();
        this._updateFilms();
        this.changingFilmcontroller.rerenderPopup(true);
      });
  }

  _onCommentsDataChange(oldCommentId, newComment, filmId, controller) {
    this._openedPopupFilmId = filmId;
    this.changingFilmcontroller = controller;

    if (newComment === null) {
      this._api
        .deleteComment(oldCommentId)
        .then(() => {
          this._commentsModel.removeComment(oldCommentId);
          return this._api.getFilms();
        })
        .then((films) => {
          films.forEach((film) => {
            if (film.id === controller._film.id) {
              this._filmsModel.setChangedFilm(film);
            }
          });
          this._filmsModel.setFilms(films);
        })
        .catch(() => {
          this.changingFilmcontroller.shake(ShakingElm.COMMENT);
        });
    } else {
      this._api
        .createComment(filmId, newComment)
        .then(({updatedFilm, updatedCommens}) => {
          this._commentsModel.setComments(updatedCommens);
          this._filmsModel.updateFilm(updatedFilm.id, updatedFilm);
        })
        .catch(() => {
          this.changingFilmcontroller.shake(ShakingElm.NEW_COMMENT);
        });
    }
  }

  _onViewChange() {
    this._showedFilmControllers.forEach((controller) =>
      controller.setDefaultView()
    );
    this._showedFilmExtraControllers.forEach((controller) =>
      controller.setDefaultView()
    );
  }

  _onFilterChange() {
    this._showingFilmsCount = SHOWING_FILM_COUNT_ON_START;
    this._updateFilms();
  }

  _onSortTypeChange() {
    this._showingFilmsCount = SHOWING_FILM_COUNT_ON_START;
    this._updateFilms();
  }
}
