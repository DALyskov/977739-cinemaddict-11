// import {FilterType} from '../const.js';
import {getRank} from '../utils/common.js';
// import {getFilmByFilter} from '../utils/filter.js';
import AbstractSmartComponent from "./abstract-smart-component.js";
import moment from 'moment';
import Chart from 'chart.js';
import ChartDataLabels from 'chartjs-plugin-datalabels';

const FILTER_ID_PREFIX = `statistic-`;
const BAR_HEIGHT = 50;
const StatFilter = {
  ALL_TIME: `all-time`,
  TODAY: `today`,
  WEEK: `week`,
  MONTH: `month`,
  YEAR: `year`,
};


const renderChart = (container, genres, genresCounts) => {
  container.height = BAR_HEIGHT * genres.length;

  const myChart = new Chart(container, {
    plugins: [ChartDataLabels],
    type: `horizontalBar`,
    data: {
      labels: genres,
      datasets: [{
        data: genresCounts,
        backgroundColor: `#ffe800`,
        hoverBackgroundColor: `#ffe800`,
        anchor: `start`
      }]
    },
    options: {
      plugins: {
        datalabels: {
          font: {
            size: 20
          },
          color: `#ffffff`,
          anchor: `start`,
          align: `start`,
          offset: 40,
        }
      },
      scales: {
        yAxes: [{
          ticks: {
            fontColor: `#ffffff`,
            padding: 100,
            fontSize: 20
          },
          gridLines: {
            display: false,
            drawBorder: false
          },
          barThickness: 24
        }],
        xAxes: [{
          ticks: {
            display: false,
            beginAtZero: true
          },
          gridLines: {
            display: false,
            drawBorder: false
          },
        }],
      },
      legend: {
        display: false
      },
      tooltips: {
        enabled: false
      }
    }
  });
  return myChart;
};

const compareDate = (watchedFilms, period) => {
  return watchedFilms.filter((film) => {
    // console.log(film.watchingDate);
    const periodDate = moment().subtract(period, `day`);
    const watchingDate = moment(new Date(film.watchingDate));
    return (periodDate < watchingDate);
  });
};

const getFilmsByPeriod = (watchedFilms, activStatFilter) => {
  let watchedFilmsBypPeriod = [];
  switch (activStatFilter) {
    case StatFilter.ALL_TIME :
      watchedFilmsBypPeriod = watchedFilms;
      break;
    case StatFilter.TODAY :
      watchedFilmsBypPeriod = compareDate(watchedFilms, 1);
      break;
    case StatFilter.WEEK :
      watchedFilmsBypPeriod = compareDate(watchedFilms, 7);
      break;
    case StatFilter.MONTH :
      watchedFilmsBypPeriod = compareDate(watchedFilms, 30);
      break;
    case StatFilter.YEAR :
      watchedFilmsBypPeriod = compareDate(watchedFilms, 365);
      break;
  }
  return watchedFilmsBypPeriod;
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

const createStatsTemplate = (watchedFilms, watchedFilmsByPeriod, genresWithCount, activStatFilter) => {
  const rank = getRank(watchedFilms.length);
  const watchedFilmsCount = watchedFilmsByPeriod.length;
  const rawDuration = watchedFilmsByPeriod.reduce((acc, obj) => {
    acc += obj.duration;
    return acc;
  }, 0);
  const hour = Math.floor(rawDuration / 60);
  const minute = rawDuration % 60;
  const topGenre = (watchedFilmsByPeriod.length > 0) ? genresWithCount[0][0] : ``;

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
    this._watchedFilms = [];
    this._watchedFilmsByPeriod = [];
    this._genresWithCount = [];
  }

  getTemplate() {
    return createStatsTemplate(
        this._watchedFilms,
        this._watchedFilmsByPeriod,
        this._genresWithCount,
        this._activStatFilter
    );
  }

  show() {
    this._activStatFilter = StatFilter.ALL_TIME;
    super.show();
    this.rerender();
  }

  rerender() {
    this._watchedFilms = this._moviesModel.getWatchedFilms();

    this._watchedFilmsByPeriod = getFilmsByPeriod(this._watchedFilms, this._activStatFilter);
    this._genresWithCount = this._getGenresWithCount(this._watchedFilmsByPeriod);

    super.rerender();
    this._renderChart();
  }

  recoveryListeners() {
    this._setFilterChange();
  }

  _getGenresWithCount(films) {
    const allFilmsGenres = films.map((film) => film.genres).flat();
    const genreStats = {};
    allFilmsGenres.forEach((genre) => {
      if (genreStats[genre]) {
        genreStats[genre] = genreStats[genre] + 1;
      } else {
        genreStats[genre] = 1;
      }
    });
    const sortedGenres = Object.entries(genreStats).sort((a, b) => b[1] - a[1]);
    return sortedGenres;
  }

  _renderChart() {
    const statisticCtx = this.getElm().querySelector(`.statistic__chart`);
    const genres = this._genresWithCount.map((v) => v[0]);
    const genresCounts = this._genresWithCount.map((v) => v[1]);

    renderChart(statisticCtx, genres, genresCounts);
  }

  _setFilterChange() {
    this.getElm().querySelector(`.statistic__filters`)
      .addEventListener(`change`, (evt) => {
        this._activStatFilter = getFilterNameById(evt.target.id);
        this.rerender();
      });
  }
}
