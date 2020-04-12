const createStatisticTemplate = (countFilms) => {
  // countFilms = String(countFilms).replace(/(\d)(?=(\d\d\d)+([^\d]|$))/g, `$1 `);
  countFilms = countFilms.toLocaleString();
  return (
    `<p>${countFilms} movies inside</p>`
  );
};

export {createStatisticTemplate};
