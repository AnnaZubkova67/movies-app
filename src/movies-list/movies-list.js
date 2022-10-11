import React from 'react';
import PropTypes from 'prop-types';

import Movie from '../movie';

import './movies-list.css';

function MoviesList({ moviesData, sessionID }) {
  const elements = moviesData.map((item) => {
    const {
      id,
      title: name,
      overview: description,
      poster_path: poster,
      release_date: date,
      vote_average: average,
      genre_ids: genreID,
    } = item;

    let rating = 0;

    if (JSON.parse(localStorage.getItem('moviesDataRate'))) {
      JSON.parse(localStorage.getItem('moviesDataRate')).map((movie) => {
        if (movie.id === item.id) {
          rating = movie.rating;
        }
      });
    } else {
      rating = 0;
    }

    return (
      <Movie
        key={id}
        id={id}
        name={name}
        description={description}
        poster={poster}
        date={date}
        overallRating={average}
        genreID={genreID}
        sessionID={sessionID}
        rating={rating}
      />
    );
  });

  return <ul className="movies-list">{elements}</ul>;
}

export default MoviesList;

MoviesList.defaultProps = {
  sessionID: '',
};

MoviesList.propTypes = {
  sessionID: PropTypes.node,
};
