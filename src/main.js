import {render} from './utils/render.js';
import API from './api.js';

import FooterStatisticsComponent from './components/footer-statistics.js';
import ProfileComponent from './components/profile.js';
import StatsComponent from './components/stats.js';

import PageController from './controllers/page.js';
import FilterController from './controllers/filter.js';

import {generateStat} from './mock/stat.js'; /* нужно будет удалить */

import MoviesModel from './models/movies.js';
import CommentsModel from './models/comments.js';

const END_POINT = `https://11.ecmascript.pages.academy/cinemaddict`;
const AUTHORIZATION = `Basic is_best_of_the_best_projects=true`;

const headerElm = document.querySelector(`.header`);
const mainElm = document.querySelector(`.main`);
const footerElm = document.querySelector(`.footer`);

const api = new API(END_POINT, AUTHORIZATION);

const stat = generateStat();

const moviesModel = new MoviesModel();
const commentsModel = new CommentsModel();
const filterController = new FilterController(mainElm, moviesModel);
const pageController = new PageController(mainElm, footerElm, moviesModel, commentsModel, api);
const statsComponent = new StatsComponent(moviesModel);

render(headerElm, new ProfileComponent(stat.watchlist.size));

render(mainElm, statsComponent);
statsComponent.hide();

filterController.render();

api.getFilms()
  .then((films) => {
    moviesModel.setFilms(films);
    pageController.render();
    render(footerElm, new FooterStatisticsComponent(moviesModel.getFilms().length));
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
