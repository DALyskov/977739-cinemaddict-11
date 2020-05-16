export default class Film {
  constructor(data) {
    this.id = data[`id`];
    this.comments = data[`comments`];
    // console.log(this.comments);
    this.title = data[`film_info`][`title`];
    this.originTitle = data[`film_info`][`alternative_title`];
    this.rating = data[`film_info`][`total_rating`];
    this.poster = data[`film_info`][`poster`];
    // был строкой, теперь число
    this.ageRating = data[`film_info`][`age_rating`];
    this.director = data[`film_info`][`director`];
    this.writers = data[`film_info`][`writers`];
    this.actors = data[`film_info`][`actors`];
    this.releaseDate = new Date(`${data[`film_info`][`release`][`date`]}`);

    // был массивом строк, попробуй переделать в просто строку
    this.country = [data[`film_info`][`release`][`release_country`]];
    this.duration = data[`film_info`][`runtime`];

    this.genres = data[`film_info`][`genre`];
    this.description = data[`film_info`][`description`];

    this.fromWatchlist = data[`user_details`][`watchlist`];
    this.isWatched = data[`user_details`][`already_watched`];
    this.watchingDate = new Date(`${data[`user_details`][`watching_date`]}`);
    this.isFavorite = data[`user_details`][`favorite`];
  }

  toRAW() {
    return {
      "id": this.id,
      "comments": this.comments,
      "film_info": {
        "title": this.title,
        "alternative_title": this.originTitle,
        "total_rating": this.rating,
        "poster": this.poster,
        "age_rating": this.ageRating,
        "director": this.director,
        "writers": this.writers,
        "actors": this.actors,
        "release": {
          "date": this.releaseDate.toISOString(),
          "release_country": this.country.join()
        },
        "runtime": this.duration,
        "genre": this.genres,
        "description": this.description
      },
      "user_details": {
        "watchlist": this.fromWatchlist,
        "already_watched": this.isWatched,
        "watching_date": this.watchingDate.toISOString(),
        "favorite": this.isFavorite
      }
    };
  }

  static parseFilm(data) {
    return new Film(data);
  }

  static parseFilms(data) {
    return data.map(Film.parseFilm);
  }

  static clone(data) {
    return new Film(data.toRAW());
  }
}
