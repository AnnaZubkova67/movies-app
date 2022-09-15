import React, { Component } from 'react';

import SwapiService from '../services/swapi-service';

import './movie.css';

export default class Movie extends Component {
  static textReduction(text) {
    let arrText = text.split(' ');
    if (arrText.length >= 20) {
      arrText = arrText.slice(0, 19);
    }
    return `${arrText.join(' ')}...`;
  }

  swapiService = new SwapiService();

  constructor(props) {
    super(props);
    this.state = {
      name: '',
      date: '',
      description: '',
      id: this.props.id,
      poster: null,
    };
  }

  updateMovie() {
    this.swapiService.getMovie(this.state.id).then((elem) => {
      this.setState({
        name: elem.title,
        date: elem.release_date,
        description: elem.overview,
        poster: elem.poster_path,
      });
    });
  }

  render() {
    this.updateMovie();
    const { name, date, description, id, poster } = this.state;
    return (
      <li className="movie" id={id}>
        <img className="movie_img" src={`https://image.tmdb.org/t/p/original/${poster}`} alt="" />
        <div className="movie_characteristics">
          <h5 className="movie_name text">{name}</h5>
          <span className="movie_date text">{date}</span>
          <div className="movie_genres">
            <button type="button" className="movie_genre text">
              Action
            </button>
            <button type="button" className="movie_genre text">
              Drama
            </button>
          </div>
          <p className="movie_description text">{Movie.textReduction(description)}</p>
        </div>
      </li>
    );
  }
}
