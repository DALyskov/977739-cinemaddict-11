const ranckProfileListDict = {
  0: `Novice`,
  10: `Fan`,
  20: `Movie Buff`,
};

const createProfileTemplate = (watchlistSize) => {
  let rank = ``;
  Object.keys(ranckProfileListDict).forEach((key) => {
    if (watchlistSize > key) {
      rank = ranckProfileListDict[key];
    }
  });

  return (
    `<section class="header__profile profile">
      <p class="profile__rating">${rank}</p>
      <img class="profile__avatar" src="images/bitmap@2x.png" alt="Avatar" width="35" height="35">
    </section>`
  );
};

export {createProfileTemplate};
