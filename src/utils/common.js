import moment from 'moment';

const ESC_KEYCODE = 27;

const getRndArrFromArr = (array, length = array.length) => {
  if (length > array.length) {
    length = array.length;
  }
  let newArr = array.slice();
  newArr.forEach((v, i, arr) => {
    const j = i + Math.floor(Math.random() * (arr.length - i));
    [arr[i], arr[j]] = [arr[j], arr[i]];
  });
  newArr = newArr.slice(0, length);
  return newArr;
};

const getRandomIntegerNumber = (min, max) => {
  return min + Math.floor(Math.random() * (max - min));
};

const checkKeyCode = (cb, evt) => {
  if (evt.keyCode === ESC_KEYCODE) {
    cb(evt);
  }
};

const formatDuration = (date) => {
  const d = moment().hour(0);
  d.minute(date);

  return `${d.hour() > 0 ? `${d.hour()}h ` : ``}${d.minute()}m`;
};

const formatReleaseDate = (date, isFullDate = false) => {
  const d = moment(date);

  const releaseDateString = isFullDate ?
    `${d.day()} ${d.format(`MMMM`)} ${d.year()}`
    : `${d.year()}`;

  return releaseDateString;
};

const formatCommentDate = (date) => {
  const d = moment(date);
  const dayAgo = moment(new Date()).diff(d, `day`);

  const commentDateString = (dayAgo > 1) ? d.format(`YYYY/M/D H:mm`) : d.fromNow();

  return commentDateString;
};

const getRank = (watchedFilmsCount) => {
  const ranckProfileListDict = {
    0: `Novice`,
    10: `Fan`,
    20: `Movie Buff`,
  };

  let rank = ranckProfileListDict[0];
  Object.keys(ranckProfileListDict).forEach((key) => {
    if (watchedFilmsCount > key) {
      rank = ranckProfileListDict[key];
    }
  });
  return rank;
};

export {
  getRndArrFromArr,
  getRandomIntegerNumber,
  checkKeyCode,
  formatDuration,
  formatReleaseDate,
  formatCommentDate,
  getRank,
};
