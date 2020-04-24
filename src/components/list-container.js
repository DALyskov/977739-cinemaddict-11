import AbstractComponent from './abstract-component.js';

const createListContainerTemplate = () => {
  return (
    `<div class="films-list__container"></div>`
  );
};

export default class ListContainer extends AbstractComponent {

  getTemplate() {
    return createListContainerTemplate();
  }
}
