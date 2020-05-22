import {FilterType, MENU_ITEM_STATS} from '../const.js';
import {getFilmByFilter} from '../utils/filter.js';
import {RenderPosition, render, replace} from '../utils/render.js';

import FilterComponent from '../components/filter.js';

export default class FilterController {
  constructor(container, filmsModel) {
    this._container = container;
    this._filmsModel = filmsModel;
    this._activeMenuItem = FilterType.ALL;

    this._onFilterChange = this._onFilterChange.bind(this);
    this.render = this.render.bind(this);

    this._filmsModel.setDataChangeHandler(this.render);
    this._filmsModel.setFilterChangeHandler(this.render);
  }

  render() {
    const filters = Object.values(FilterType).map((filterType) => {
      return {
        name: filterType,
        count: getFilmByFilter(this._filmsModel.getFilmsAll(), filterType).length,
        checked: filterType === this._activeMenuItem,
      };
    });

    const oldComponent = this._filterComponent;
    this._filterComponent = new FilterComponent(filters, this._activeMenuItem);
    this._filterComponent.setFilterChangeHandler(this._onFilterChange);

    if (oldComponent) {
      replace(this._filterComponent, oldComponent);
    } else {
      render(this._container, this._filterComponent, RenderPosition.AFTERBEGIN);
    }
  }

  _onFilterChange(filterType) {
    if (this._activeMenuItem === filterType) {
      return;
    }

    const isFilterTypeStats = Boolean(filterType === MENU_ITEM_STATS);

    if (isFilterTypeStats) {
      this._activeMenuItem = filterType;
      this.render();
      this.onMenuItemChangeHandler(isFilterTypeStats);
    } else {

      if (this._activeMenuItem === MENU_ITEM_STATS) {
        this.onMenuItemChangeHandler(isFilterTypeStats);
      }

      this._activeMenuItem = filterType;
      this._filmsModel.setFilter(filterType);
    }
  }

  // _onMenuItemChangeHandler() {}
}
