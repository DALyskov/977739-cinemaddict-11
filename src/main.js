import {RenderPosition, render} from './utils/render.js';

import FooterStatisticsComponent from './components/footer-statistics.js';
import ProfileComponent from './components/profile.js';

import PageController from './controllers/page.js';
import FilterController from './controllers/filter.js';

import {generateFilms} from './mock/film.js';
import {generateStat} from './mock/stat.js';

import MoviesModel from './models/movies.js';

const FILM_COUNT = 5;

const headerElm = document.querySelector(`.header`);
const mainElm = document.querySelector(`.main`);
const footerElm = document.querySelector(`.footer`);

const stat = generateStat();
const films = generateFilms(FILM_COUNT);

const moviesModel = new MoviesModel();
moviesModel.setFilms(films);

render(headerElm, new ProfileComponent(stat.watchlist.size));

const filterController = new FilterController(mainElm, moviesModel);
filterController.render();

const pageController = new PageController(mainElm, footerElm, moviesModel);
pageController.render();

render(footerElm, new FooterStatisticsComponent(FILM_COUNT));
