const createFilmCardTemplate = (film) => {
  const {title, genres, poster, description, rating, duration, releaseDate} = film;

  const genre = genres[0];
  const releaseYear = releaseDate.getFullYear();

  let reducedDescription = description;
  if (description.length > 140) {
    reducedDescription = description.slice(0, 139).concat(`\u{2026}`);
  }

  const commentsCount = 5;

  return (
    `<article class="film-card">
      <h3 class="film-card__title">${title}</h3>
      <p class="film-card__rating">${rating}</p>
      <p class="film-card__info">
        <span class="film-card__year">${releaseYear}</span>
        <span class="film-card__duration">${duration}</span>
        <span class="film-card__genre">${genre}</span>
      </p>
      <img src="./images/posters/${poster}" alt="${title}" class="film-card__poster">
      <p class="film-card__description">${reducedDescription}</p>
      <a class="film-card__comments">${commentsCount} comments</a>
      <form class="film-card__controls">
        <button class="film-card__controls-item button film-card__controls-item--add-to-watchlist">Add to watchlist</button>
        <button class="film-card__controls-item button film-card__controls-item--mark-as-watched">Mark as watched</button>
        <button class="film-card__controls-item button film-card__controls-item--favorite">Mark as favorite</button>
      </form>
    </article>`
  );
};

export {createFilmCardTemplate};
