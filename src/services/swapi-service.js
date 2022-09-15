export default class SwapiService {
  static async getResource(url) {
    const res = await fetch(`${url}`);

    if (!res.ok) {
      throw new Error('Не удалось выполнить запрос');
    }

    return res.json();
  }

  async getAllMovies() {
    const res = await this.getResource(
      'https://api.themoviedb.org/3/search/movie?api_key=143d9278f8ac71cddd8d5e4c363d429b&query=return'
    );
    return res;
  }

  getMovie(id) {
    return this.getResource(
      `https://api.themoviedb.org/3/movie/${id}?api_key=143d9278f8ac71cddd8d5e4c363d429b&query=return`
    );
  }
}
