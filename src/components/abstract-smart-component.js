import AbstractComponent from './abstract-component.js';

export default class AbstractSmartComponent extends AbstractComponent {
  recoveryListeners() {
    throw new Error(`Abstract method not implemented: recoveryListeners`);
  }

  rerender() {
    const oldElm = this.getElm();
    const parent = oldElm.parentElement;

    this.removeElm();

    const newElm = this.getElm();

    parent.replaceChild(newElm, oldElm);

    this.recoveryListeners();
  }
}
