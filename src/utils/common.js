const ESC_KEYCODE = 27;

export const getRndArrFromArr = (array, length = array.length) => {
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

export const checkKeyCode = (cb, evt) => {
  if (evt.keyCode === ESC_KEYCODE) {
    cb(evt);
  }
};

export const getRank = (watchedFilmsCount) => {
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
