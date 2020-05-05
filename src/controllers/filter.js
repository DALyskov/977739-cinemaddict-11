import {RenderPosition, render} from '../utils/render.js';
import {FilterType} from '../const.js';

import FilterComponent from '../components/filter.js';

export default class FilterController {
  constructor(container, moviesModel) {
    this._container = container;
    this._moviesModel = moviesModel;
    this._activeFilterType = FilterType.ALL;

    this._onFilterChange = this._onFilterChange.bind(this);
  }

  render() {
    const filters = Object.values(FilterType).map((filterType) => {
      return {
        name: filterType,
        count: 1/* getMovieByFilter(allMovies, filterType).length */,
        checked: filterType === this._activeFilterType,
      };
    });

    const filterComponent = new FilterComponent(filters);

    filterComponent.setFilterChangeHandler(this._onFilterChange);

    render(this._container, filterComponent, RenderPosition.AFTERBEGIN);
  }

  _onFilterChange(filterType) {
    this._moviesModel.setFilter(filterType);
    this._activeFilterType = filterType;
  }
}
