import {render} from './utils/render.js';
import API from './api/index.js';
import Provider from './api/provider.js';
import Store from './api/store.js';

import FooterStatisticsComponent from './components/footer-statistics.js';
import ProfileComponent from './components/profile.js';
import StatsComponent from './components/stats.js';

import FilterController from './controllers/filter.js';
import PageController from './controllers/page.js';

import CommentsModel from './models/comments.js';
import FilmsModel from './models/films.js';

const END_POINT = `https://11.ecmascript.pages.academy/cinemaddict`;
const AUTHORIZATION = `Basic is_best_of_the_best_projects=true`;

const STORE_PREFIX = `cinemaddict-localstorage`;
const STORE_VER = `v1`;
const STORE_NAME = `${STORE_PREFIX}-${STORE_VER}`;

const headerElm = document.querySelector(`.header`);
const mainElm = document.querySelector(`.main`);
const footerElm = document.querySelector(`.footer`);

const onMenuItemChangeHandler = (isStatsTarget) => {
  if (isStatsTarget) {
    pageController.hide();
    statsComponent.show();
  } else {
    statsComponent.hide();
    pageController.show();
  }
};

const api = new API(END_POINT, AUTHORIZATION);
const store = new Store(STORE_NAME, window.localStorage);
const apiWithProvider = new Provider(api, store);
const filmsModel = new FilmsModel();
const commentsModel = new CommentsModel();
const filterController = new FilterController(
    mainElm,
    filmsModel,
    onMenuItemChangeHandler
);
const pageController = new PageController(
    mainElm,
    footerElm,
    filmsModel,
    commentsModel,
    apiWithProvider
);
const statsComponent = new StatsComponent(filmsModel);
const profileComponent = new ProfileComponent(filmsModel);
const footerStatisticsComponent = new FooterStatisticsComponent(filmsModel);

render(mainElm, statsComponent);
statsComponent.hide();
filterController.render();
render(headerElm, profileComponent);
render(footerElm, footerStatisticsComponent);

apiWithProvider
  .getFilms()
  .then((films) => {
    filmsModel.setFilms(films);
    pageController.render(true);
  })
  .catch(() => {
    pageController.render(false);
    pageController.renderErr();
  });

window.addEventListener(`load`, () => {
  navigator.serviceWorker.register(`/sw.js`).then();
});

window.addEventListener(`online`, () => {
  document.title = document.title.replace(` [offline]`, ``);
  if (apiWithProvider.getSynceStatus()) {
    return;
  }
  apiWithProvider.sync();
});

window.addEventListener(`offline`, () => {
  document.title += ` [offline]`;
});
