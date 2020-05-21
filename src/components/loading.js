import AbstractComponent from './abstract-component.js';

const createLoadingTemplate = () => {
  return (
    `<h2 class="films-list__title">Loading...</h2>`
  );
};

export default class Loading extends AbstractComponent {
  constructor() {
    super();
  }
  getTemplate() {
    return createLoadingTemplate();
  }
}
