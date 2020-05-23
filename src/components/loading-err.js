import AbstractComponent from './abstract-component.js';

const createLoadingTemplate = () => {
  return `<h2 class="films-list__title">Failed to load data</h2>`;
};

export default class LoadingErr extends AbstractComponent {
  constructor() {
    super();
  }
  getTemplate() {
    return createLoadingTemplate();
  }
}
