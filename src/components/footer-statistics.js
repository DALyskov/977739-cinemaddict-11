import AbstractSmartComponent from './abstract-smart-component';

const createFooterStatisticsTemplate = (countFilms) => {
  countFilms = countFilms.toLocaleString();
  return `<p>${countFilms} movies inside</p>`;
};

export default class FooterStatistics extends AbstractSmartComponent {
  constructor(filmsModel) {
    super();
    this._filmsModel = filmsModel;

    this.rerender = this.rerender.bind(this);
    this._filmsModel.setDataChangeHandler(this.rerender);
  }

  getTemplate() {
    return createFooterStatisticsTemplate(
        this._filmsModel.getFilmsAll().length
    );
  }

  recoveryListeners() {}
}
