import {getRndArrFromArr, getRandomIntegerNumber} from '../utils/common.js';
const emotions = [`smile`, `sleeping`, `puke`, `angry`];

const getRandomArrayItem = (array) => {
  const randomIndex = getRandomIntegerNumber(0, array.length);
  return array[randomIndex];
};

let IdCounter = 0;

const getCommentId = () => {
  const CommentId = IdCounter;
  IdCounter++;
  return CommentId;
};

const generateComent = () => {
  const emotion = getRandomArrayItem(emotions);
  return {
    id: String(getCommentId()),
    author: emotion,
    emotion,
    date: new Date(2020, 4, (Math.random() * 3), (Math.random() * 23)),
    content: getRndArrFromArr(emotions,
        getRandomIntegerNumber(2, emotions.length)).join(`, `),
  };
};

const generateComents = (count) => {
  return new Array(count)
    .fill(``)
    .map(generateComent);
};

export {generateComents};
