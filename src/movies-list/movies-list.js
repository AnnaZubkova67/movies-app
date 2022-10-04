import React from 'react';
import { Spin, Alert } from 'antd';
import { LoadingOutlined } from '@ant-design/icons';
import PropTypes from 'prop-types';

import Movie from '../movie';

import './movies-list.css';
import 'antd/dist/antd.css';

function MoviesList({ moviesData, loading, error, network, sessionID }) {
  const antIcon = (
    <LoadingOutlined
      style={{
        fontSize: 45,
      }}
      spin
    />
  );
  const loadIcon = (
    <div className="spin">
      <Spin indicator={antIcon} />
    </div>
  );

  const errorElement = (
    <div className="error">
      <Alert message="Error" description="Что-то пошло не так, невозможно загрузить данные :(" type="error" showIcon />
    </div>
  );

  const networkElement = (
    <div className="error">
      <Alert message="Error" description="Вы не подключены к сети :(" type="error" showIcon />
    </div>
  );

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
        average={average}
        genreID={genreID}
        sessionID={sessionID}
        rating={rating}
      />
    );
  });

  const errorMessage = error ? errorElement : null;
  const spinner = loading && !error ? loadIcon : null;
  const content = !loading && network ? elements : null;
  const networkMessage =
    (!network && !loading && moviesData.length !== 0) || (!network && !loading) ? networkElement : null;

  return (
    <ul className="movies-list">
      {errorMessage}
      {content}
      {spinner}
      {networkMessage}
    </ul>
  );
}

export default MoviesList;

MoviesList.defaultProps = {
  loading: true,
  error: false,
  network: true,
  sessionID: '',
};

MoviesList.propTypes = {
  loading: PropTypes.bool,
  error: PropTypes.bool,
  network: PropTypes.bool,
  sessionID: PropTypes.node,
};
