//  из page конструктора
// this._filmsListComponent = null;


//  из film-controller
// export default class MovieController {

// this._filmCardComponent = null;
// this._filmPopupComponent = null;
// this._film = null;
// this._filmComments = null;


// работа с сервером
// _load({url, method = Method.GET, body = null, headers = new Headers()}) {
//   headers.append(`Authorization`, this._authorization);

//   return this._timeout(1000, fetch(`${this._endPoint}/${url}`, {method, body, headers}))
//     .then(checkStatus)
//     .catch((err) => {
//       throw err;
//     });
// }

// _timeout(ms, promise) {
//   return new Promise((resolve, reject) => {
//     setTimeout(() => {
//       reject(new Error(`timeout`));
//     }, ms);
//     promise.then(resolve, reject);
//   });
// }


// _load({url, method = Method.GET, body = null, headers = new Headers()}) {
//   headers.append(`Authorization`, this._authorization);

//   return Promise.race([
//     fetch(`${this._endPoint}/${url}`, {method, body, headers}),
//     new Promise((_, reject) => setTimeout(() => reject(new Error(`timeout`)), 1000))
//   ])
//     .then(checkStatus)
//     .catch((err) => {
//       throw err;
//     });
// }
