import React, { Component } from 'react';

import Movie from '../movie';
import './movies-list.css';
import SwapiService from '../services/swapi-service';

export default class MoviesList extends Component {
  swapiService = new SwapiService();

  constructor() {
    super();
    this.state = {
      moviesData: [],
    };
  }

  getListMovies() {
    this.swapiService.getAllMovies().then((mov) => {
      this.setState({
        moviesData: mov.results,
      });
    });
  }

  render() {
    this.getListMovies();
    const { moviesData } = this.state;

    const elements = moviesData.map((item) => {
      const { id } = item;
      return <Movie key={id} id={id} />;
    });
    return <ul className="movies-list">{elements}</ul>;
  }
}
