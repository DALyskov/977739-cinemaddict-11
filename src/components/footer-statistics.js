// import AbstractComponent from './abstract-component.js';
import AbstractSmartComponent from './abstract-smart-component';

const createFooterStatisticsTemplate = (countFilms) => {
  // countFilms = String(countFilms).replace(/(\d)(?=(\d\d\d)+([^\d]|$))/g, `$1 `);
  countFilms = countFilms.toLocaleString();
  return (
    `<p>${countFilms} movies inside</p>`
  );
};

export default class FooterStatistics extends AbstractSmartComponent {
  constructor(moviesModel) {
    super();
    this._moviesModel = moviesModel;

    this.rerender = this.rerender.bind(this);
    this._moviesModel.setDataChangeHandler(this.rerender);
  }

  getTemplate() {
    return createFooterStatisticsTemplate(this._moviesModel.getFilmsAll().length);
  }

  recoveryListeners() {}
}
