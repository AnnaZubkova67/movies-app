import React, { Component } from 'react';

import { SwapiServiceConsumer } from '../swapi-service-context';
import './genre.css';

export default class Genre extends Component {
  render() {
    const { genreID } = this.props;
    return (
      <SwapiServiceConsumer>
        {(genre) => {
          if (genre.length !== 0) {
            const genres = genreID.map((id) => {
              const a = genre.filter((gen) => id === gen.id);
              if (typeof a[0] !== 'undefined' && a.length !== 0) {
                return a[0];
              }
              return true;
            });

            const genreButton = genres.map((gen, i) => {
              if (i <= 2) {
                return (
                  <button key={gen.id} type="button" className="movie_genre text">
                    {gen.name}
                  </button>
                );
              }
              return true;
            });
            return <div className="movie_genres">{genreButton}</div>;
          }
          return true;
        }}
      </SwapiServiceConsumer>
    );
  }
}
