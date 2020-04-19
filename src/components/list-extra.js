import {createElm} from '../utils.js';

// const CONTENT_EXTRA_TITLES = [`Top rated`, `Most commented`];

// const createListExtraMarkup = (title) => {
//   return (
//     `<section class="films-list--extra">
//       <h2 class="films-list__title">${title}</h2>
//     </section>`
//   );
// };

const createListExtraTemplate = (title) => {
  // const ListExtraMarkup = CONTENT_EXTRA_TITLES.map((v) => createListExtraMarkup(v)).join(`\n`);
  // return ListExtraMarkup;
  return (
    `<section class="films-list--extra">
      <h2 class="films-list__title">${title}</h2>
    </section>`
  );
};

export default class ListExtra {
  constructor(title) {
    this._title = title;
    this._elm = null;
  }

  getTemplate() {
    return createListExtraTemplate(this._title);
  }

  getElm() {
    if (!this._elm) {
      this._elm = createElm(this.getTemplate());
    }
    // console.log(this.getTemplate());
    // console.log(this._elm);
    return this._elm;
  }

  removeElm() {
    this._elm = null;
  }
}
