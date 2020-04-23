import FooterStatisticsComponent from './components/footer-statistics.js';
import MainNavComponent from './components/main-nav.js';
import ProfileComponent from './components/profile.js';
import PageController from './controllers/page.js';
import {generateFilms} from './mock/film.js';
import {generateFilters} from './mock/filter.js';
import {generateStat} from './mock/stat.js';

import {RenderPosition, render} from './utils/render.js';

const FILM_COUNT = 10;

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

render(headerElm, new ProfileComponent(stat.watchlist.size));
render(mainElm, new MainNavComponent(filters), RenderPosition.AFTERBEGIN);

const pageController = new PageController(mainElm, footerElm, films);
pageController.render();

render(footerElm, new FooterStatisticsComponent(FILM_COUNT));
