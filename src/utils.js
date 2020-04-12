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

export {getRndArrFromArr, getRandomIntegerNumber};
