import {FilterType} from '../const.js';
import {getRank} from '../utils/common.js';
import {getFilmByFilter} from '../utils/filter.js';
import AbstractSmartComponent from "./abstract-smart-component.js";
import moment from 'moment';
import Chart from 'chart.js';
import ChartDataLabels from 'chartjs-plugin-datalabels';

const FILTER_ID_PREFIX = `statistic-`;

const StatFilter = {
  ALL_TIME: `all-time`,
  TODAY: `today`,
  WEEK: `week`,
  MONTH: `month`,
  YEAR: `year`,
};

const getFilterNameById = (id) => {
  return id.substring(FILTER_ID_PREFIX.length);
};

const createFilterMarkup = (filter, activStatFilter) => {
  const check = (filter === activStatFilter) ? `checked` : ``;
  let labelContent = filter.split(`-`).join(` `);
  labelContent = labelContent[0].toUpperCase() + labelContent.substring(1);
  return (
    `<input type="radio" class="statistic__filters-input visually-hidden" name="statistic-filter" id="statistic-${filter}" value="${filter}" ${check}>
    <label for="statistic-${filter}" class="statistic__filters-label">${labelContent}</label>`
  );
};


const createStatsTemplate = (films, activStatFilter) => {
  let watchedFilms = getFilmByFilter(films, FilterType.HISTORY);
  // const watchedFilms = films.filter((film) => film.isWatched);

  watchedFilms = watchedFilms.filter((film) => {
    const periodDate = moment().subtract(1, `all-time`);
    const watchingDate = moment(new Date(film.watchingDate));
    console.log(periodDate, watchingDate);
    console.log(periodDate < watchingDate);
    return (periodDate < watchingDate);
  });

  console.log(watchedFilms);

  const watchedFilmsCount = watchedFilms.length;

  watchedFilms.forEach((v) => console.log(v.watchingDate));


  // const time = moment().subtract(1, `week`);
  // const date = (watchedFilms.length > 0) ? watchedFilms[1].watchingDate : null;

  // console.log(time, moment(new Date(date)));
  // console.log((time < moment(new Date(date))));


  const rank = getRank(watchedFilmsCount);

  const rawDuration = watchedFilms.reduce((acc, obj) => {
    acc += obj.duration;
    return acc;
  }, 0);

  const hour = Math.floor(rawDuration / 60);
  const minute = rawDuration % 60;

  const allFilmsGenres = watchedFilms.map((film) => film.genres).flat();
  const genreStats = {};

  allFilmsGenres.forEach((genre) => {
    if (genreStats[genre]) {
      genreStats[genre] = genreStats[genre] + 1;
    } else {
      genreStats[genre] = 1;
    }
  });

  const sortedGenres = Object.entries(genreStats).sort((a, b) => b[1] - a[1]);
  const topGenre = (sortedGenres.length > 0) ? sortedGenres[0][0] : ``;

  const filtersMarkup = Object.entries(StatFilter)
    .map((it) => createFilterMarkup(it[1], activStatFilter)).join(`\n`);

  return (
    `<section class="statistic">
    <p class="statistic__rank">
      Your rank
      <img class="statistic__img" src="images/bitmap@2x.png" alt="Avatar" width="35" height="35">
      <span class="statistic__rank-label">${rank}</span>
    </p>

    <form action="https://echo.htmlacademy.ru/" method="get" class="statistic__filters">
      <p class="statistic__filters-description">Show stats:</p>
      ${filtersMarkup}
    </form>

    <ul class="statistic__text-list">
      <li class="statistic__text-item">
        <h4 class="statistic__item-title">You watched</h4>
        <p class="statistic__item-text">${watchedFilmsCount} <span class="statistic__item-description">movie${watchedFilmsCount > 1 ? `s` : ``}</span></p>
      </li>
      <li class="statistic__text-item">
        <h4 class="statistic__item-title">Total duration</h4>
        <p class="statistic__item-text">${hour} <span class="statistic__item-description">h</span> ${minute} <span class="statistic__item-description">m</span></p>
      </li>
      <li class="statistic__text-item">
        <h4 class="statistic__item-title">Top genre</h4>
        <p class="statistic__item-text">${topGenre}</p>
      </li>
    </ul>

    <div class="statistic__chart-wrap">
      <canvas class="statistic__chart" width="1000"></canvas>
    </div>

  </section>`
  );
};

export default class Stats extends AbstractSmartComponent {
  constructor(moviesModel) {
    super();
    this._moviesModel = moviesModel;
    this._activStatFilter = StatFilter.ALL_TIME;
  }

  getTemplate() {
    return createStatsTemplate(this._moviesModel.getFilmsAll(), this._activStatFilter);
  }

  show() {
    super.show();

    this.rerender();
  }

  recoveryListeners() {
    this._setFilterChange();
  }

  _setFilterChange() {
    this._elm.querySelector(`.statistic__filters`)
      .addEventListener(`change`, (evt) => {
        this._activStatFilter = getFilterNameById(evt.target.id);
        this.rerender();
      });
  }
}
