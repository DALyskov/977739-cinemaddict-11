import AbstractComponent from './abstract-component.js';

const createFooterStatisticsTemplate = (countFilms) => {
  // countFilms = String(countFilms).replace(/(\d)(?=(\d\d\d)+([^\d]|$))/g, `$1 `);
  countFilms = countFilms.toLocaleString();
  return (
    `<p>${countFilms} movies inside</p>`
  );
};

export default class FooterStatistics extends AbstractComponent {
  constructor(countFilms) {
    super();
    this._countFilms = countFilms;
  }

  getTemplate() {
    return createFooterStatisticsTemplate(this._countFilms);
  }
}
