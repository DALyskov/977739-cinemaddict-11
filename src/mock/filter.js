const filterNames = [`All movies`, `Watchlist`, `History`, `Favorites`];

const generateFilters = () => {
  return filterNames.map((it) => {
    return {
      name: it,
      count: 0,
    };
  });
};

export {generateFilters};
