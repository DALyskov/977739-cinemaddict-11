const filterNames = [`All movies`, `Watchlist`, `History`, `Favorites`];
const sortingNames = [`default`, `date`, `rating`];

const generateFilters = () => {
  return filterNames.map((it) => {
    return {
      name: it,
      count: 0,
    };
  });
};

const generateSorts = () => {
  return sortingNames.map((it) => {
    return {
      name: it,
    };
  });
};

export {generateFilters, generateSorts};
