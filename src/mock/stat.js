import {films} from './film.js';
import {getRndArrFromArr, getRandomIntegerNumber} from '../utils/common.js';

const generateStat = () => {
  return {
    login: `Dmitry`,
    watchlist: new Set(getRndArrFromArr(films.
      map((v) => v.title), getRandomIntegerNumber(0, 10))),
    history: new Set(getRndArrFromArr(films.
      map((v) => v.title), getRandomIntegerNumber(0, 10))),
    favorites: new Set(getRndArrFromArr(films.
      map((v) => v.title), getRandomIntegerNumber(0, 10))),
  };
};

export {generateStat};
