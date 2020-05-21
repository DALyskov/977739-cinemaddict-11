import {render} from './utils/render.js';
import API from './api.js';

import FooterStatisticsComponent from './components/footer-statistics.js';
import ProfileComponent from './components/profile.js';
import StatsComponent from './components/stats.js';

import PageController from './controllers/page.js';
import FilterController from './controllers/filter.js';

import FilmsModel from './models/films.js';
import CommentsModel from './models/comments.js';

const END_POINT = `https://11.ecmascript.pages.academy/cinemaddict`;
const AUTHORIZATION = `Basic is_best_of_the_best_projects=true`;

const headerElm = document.querySelector(`.header`);
const mainElm = document.querySelector(`.main`);
const footerElm = document.querySelector(`.footer`);

const api = new API(END_POINT, AUTHORIZATION);
const filmsModel = new FilmsModel();
const commentsModel = new CommentsModel();

const filterController = new FilterController(mainElm, filmsModel);
const pageController = new PageController(mainElm, footerElm, filmsModel, commentsModel, api);
const statsComponent = new StatsComponent(filmsModel);
const profileComponent = new ProfileComponent(filmsModel);
const footerStatisticsComponent = new FooterStatisticsComponent(filmsModel);


render(mainElm, statsComponent);
statsComponent.hide();
filterController.render();
render(headerElm, profileComponent);
render(footerElm, footerStatisticsComponent);


api.getFilms()
  .then((films) => {
    filmsModel.setFilms(films);
    pageController.render();
  });

filterController.onMenuItemChangeHandler = (isStatsTarget) => {
  if (isStatsTarget) {
    pageController.hide();
    statsComponent.show();
  } else {
    statsComponent.hide();
    pageController.show();
  }
};
