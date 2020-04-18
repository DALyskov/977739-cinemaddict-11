import {createElm} from '../utils.js';

const createFooterStatisticsTemplate = (countFilms) => {
  // countFilms = String(countFilms).replace(/(\d)(?=(\d\d\d)+([^\d]|$))/g, `$1 `);
  countFilms = countFilms.toLocaleString();
  return (
    `<p>${countFilms} movies inside</p>`
  );
};

export default class FooterStatistics {
  constructor(countFilms) {
    this._countFilms = countFilms;
    this._elm = null;
  }

  getTemplate() {
    return createFooterStatisticsTemplate(this._countFilms);
  }

  getElm() {
    if (!this._elm) {
      this._elm = createElm(this.getTemplate());
    }
    return this._elm;
  }

  removeElm() {
    this._elm = null;
  }
}
