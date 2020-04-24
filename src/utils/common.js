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

export {
  getRndArrFromArr,
  getRandomIntegerNumber,
  checkKeyCode,
};
