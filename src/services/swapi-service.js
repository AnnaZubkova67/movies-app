export default class SwapiService {
  constructor() {
    this.apiKey = '143d9278f8ac71cddd8d5e4c363d429b';
  }

  // гет запрос
  async getResource(url) {
    const res = await fetch(`${url}`);

    if (!res.ok) {
      throw new Error('Не удалось выполнить запрос');
    }

    return res.json();
  }

  // гет запрос на получение постера
  async getPoster(poster) {
    const res = await fetch(`https://image.tmdb.org/t/p/original${poster}`);
    if (!res.ok) {
      throw new Error('Не удалось выполнить запрос');
    }
    return res;
  }

  // гет запрос на получение списка фильмов
  async getAllMovies(request = 'return', pagIndex = 1) {
    const res = await this.getResource(
      `https://api.themoviedb.org/3/search/movie?&api_key=${this.apiKey}&query=${request}&page=${pagIndex}`
    );
    return res;
  }

  // гет запрос на получение жанров
  async getGenre() {
    const res = await this.getResource(`https://api.themoviedb.org/3/genre/movie/list?&api_key=${this.apiKey}`);
    return res.genres;
  }

  // гет запрос на получение id сессии
  async getSession() {
    const res = await this.getResource(
      `https://api.themoviedb.org/3/authentication/guest_session/new?api_key=${this.apiKey}`
    );
    return res.guest_session_id;
  }

  // гет запрос на получение оцененных фильмов
  async gerRating(id, page) {
    const res = await this.getResource(
      `https://api.themoviedb.org/3/guest_session/${id}/rated/movies?api_key=${this.apiKey}&language=en-US&sort_by=created_at.asc&page=${page}`
    );

    return res;
  }

  // пост запрос для отправки оценки фильма
  postRating(id, idMovies, rate) {
    const body = {
      value: rate,
    };
    return fetch(
      `https://api.themoviedb.org/3/movie/${idMovies}/rating?api_key=${this.apiKey}&guest_session_id=${id}`,
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json;charset=utf-8',
        },
        body: JSON.stringify(body),
      }
    );
  }
}
