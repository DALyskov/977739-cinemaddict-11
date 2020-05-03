import {getRndArrFromArr, getRandomIntegerNumber} from '../utils/common.js';

const films = [
  {
    title: `The Dance of Life`,
    genres: [`Musical`],
    poster: `the-dance-of-life.jpg`,
    description: `Burlesque comic Ralph "Skid" Johnson (Skelly), and specialty dancer Bonny Lee King (Carroll), end up together on a cold.`,
    releaseDate: 1929,
    duration: 115,
  }, {
    title: `Sagebrush Trail`,
    genres: [`Western`],
    poster: `sagebrush-trail.jpg`,
    description: `Sentenced for a murder he did not commit, John Brant escapes from prison determined to find the real killer.`,
    releaseDate: 1933,
    duration: 54,
  }, {
    title: `The Man with the Golden Arm`,
    genres: [`Drama`],
    poster: `the-man-with-the-golden-arm.jpg`,
    description: `Frankie Machine (Frank Sinatra) is released from the federal Narcotic Farm in Lexington, Kentucky with a set of drums.`,
    releaseDate: 1955,
    duration: 119,
  }, {
    title: `Santa Claus Conquers the Martians`,
    genres: [`Comedy`],
    poster: `santa-claus-conquers-the-martians.jpg`,
    description: `The Martians Momar ("Mom Martian") and Kimar ("King Martian") are worried that their children Girmar ("Girl Martian") and Bomar ("Boy Martin").`,
    releaseDate: 1964,
    duration: 81,
  }, {
    title: `Popeye the Sailor Meets Sindbad the Sailor`,
    genres: [`Cartoon`],
    poster: `popeye-meets-sinbad.png`,
    description: `In this short, Sindbad the Sailor (presumably Bluto playing a "role") proclaims himself, in song, to be the greatest sailor.`,
    releaseDate: 1936,
    duration: 16,
  }, {
    title: `The Great Flamarion`,
    genres: [`Mystery`],
    poster: `the-great-flamarion.jpg`,
    description: `The film opens following a murder at a cabaret in Mexico City in 1936, and then presents the events leading up to it in flashback.`,
    releaseDate: 1945,
    duration: 78,
  }, {
    title: `Made for Each Other`,
    genres: [`Comedy`],
    poster: `made-for-each-other.png`,
    description: `John Mason (James Stewart) is a young, somewhat timid attorney in New York City. He has been doing his job well.`,
    releaseDate: 1939,
    duration: 92,
  }
];

const genres = [`Drama`, `Film-Noir`, `Mystery`, `Comedy`, `Cartoon`, `Western`];

const descriptionItems = [
  `Lorem ipsum dolor sit amet, consectetur adipiscing elit.`,
  `Cras aliquet varius magna, non porta ligula feugiat eget.`,
  `Fusce tristique felis at fermentum pharetra.`,
  `Aliquam id orci ut lectus varius viverra.`,
  `Nullam nunc ex, convallis sed finibus eget, sollicitudin eget ante.`,
  `Phasellus eros mauris, condimentum sed nibh vitae, sodales efficitur ipsum.`,
  `Sed blandit, eros vel aliquam faucibus, purus ex euismod diam, eu luctus nunc ante ut dui.`,
  `Sed sed nisi sed augue convallis suscipit in sed felis. Aliquam erat volutpat.`,
  `Nunc fermentum tortor ac porta dapibus.`,
  `In rutrum ac purus sit amet tempus.`
];

const directors = [`Steven Spielberg`, `Quentin Tarantino`, `Christopher Nolan`, `Martin Scorsese`, `Alfred Hitchcock`];

const writers = [`Anne Wigton`, `Heinz Herald`, `Richard Weil`];
const actors = [`Erich von Stroheim`, `Mary Beth Hughes`, `Dan Duryea`];
const countries = [`USA`, `Russia`, `ABH`, `BGR`, `EGY`];
const ageRatings = [`18+`, `PG-13`, `G`, `PG`, `NC-17`];

const emotions = [`smile`, `sleeping`, `puke`, `angry`];

const getRandomArrayItem = (array) => {
  const randomIndex = getRandomIntegerNumber(0, array.length);
  return array[randomIndex];
};

const generateComent = () => {
  const emotion = getRandomArrayItem(emotions);
  return {
    author: emotion,
    emotion,
    date: new Date(2020, 4, (Math.random() * 3), (Math.random() * 23)),
    content: getRndArrFromArr(emotions,
        getRandomIntegerNumber(2, emotions.length)).join(`, `),
  };
};

const generateFilm = () => {
  const film = getRandomArrayItem(films);
  film.genres = new Set([...film.genres, ...getRndArrFromArr(genres, 1)]);
  film.genres = Array.from(film.genres);
  film.description = film.description + ` ${getRndArrFromArr(descriptionItems, getRandomIntegerNumber(0, 5)).join(` `)}`;
  film.rating = Math.floor(Math.random() * 100) / 10;
  film.releaseDate = new Date(film.releaseDate instanceof Date ?
    film.releaseDate.getFullYear() : film.releaseDate, getRandomIntegerNumber(0, 11));
  film.originTitle = film.title;
  film.director = directors[getRandomIntegerNumber(0, directors.length)];
  film.writers = getRndArrFromArr(writers, getRandomIntegerNumber(1, writers.length));
  film.actors = getRndArrFromArr(actors, getRandomIntegerNumber(1, actors.length));
  film.country = getRndArrFromArr(countries, 1);
  film.ageRating = getRndArrFromArr(ageRatings, 1);
  film.coments = new Array(getRandomIntegerNumber(0, 6)).fill(``).map(generateComent);
  film.fromWatchlist = Math.random() > 0.5;
  film.isWatched = Math.random() > 0.5;
  film.isFavorite = Math.random() > 0.5;
  return film;
};

const generateFilms = (count) => {
  return new Array(count)
    .fill(``)
    .map(generateFilm);
};

export {generateFilms, films};
