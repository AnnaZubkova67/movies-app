import React, { Component } from 'react';
import { Rate, Spin } from 'antd';
import './movie.css';
import PropTypes from 'prop-types';
import { LoadingOutlined } from '@ant-design/icons';

import Genre from '../genre';
import SwapiService from '../services/swapi-service';

import movieImage from './movie.png';

export default class Movie extends Component {
  // сокращение текста
  static textReduction(text, wordCount) {
    let arrText = text.split(' ');
    if (arrText.length >= wordCount + 1) {
      arrText = arrText.slice(0, wordCount);
      return `${arrText.join(' ')}...`;
    }
    return `${arrText.join(' ')}`;
  }

  // преобразование даты
  static dataFormat = (data) => {
    const mount = {
      '01': 'January',
      '02': 'February',
      '03': 'March',
      '04': 'April',
      '05': 'May',
      '06': 'June',
      '07': 'July',
      '08': 'August',
      '09': 'September',
      10: 'October',
      11: 'November',
      12: 'December',
    };
    const dataArr = data.split('-');
    return `${mount[dataArr[1]]} ${dataArr[2]}, ${dataArr[0]}`;
  };

  swapiSerwice = new SwapiService();

  constructor() {
    super();
    this.state = {
      average: 0,
      poster: null,
      error: false,
      posterStatus: false,
    };
  }

  componentDidMount() {
    this.thereIsPoster();
    if (this.props.rating) {
      this.setState({
        average: this.props.rating,
      });
    }
  }

  componentDidUpdate(prevProps, prevState) {
    if (this.props.rating && !prevState.average) {
      this.setState({
        average: this.props.rating,
      });
    }
  }

  // постера нет
  errorPoster = () => {
    this.setState({
      error: true,
    });
  };

  // установление рейтинга фильму
  onRate = (e) => {
    if (this.props.sessionID) {
      this.swapiSerwice.postRating(this.props.sessionID, this.props.id, e);
    }
    this.swapiSerwice.getAllMovies();
    this.setState({
      average: e,
    });
  };

  // есть ли постер
  thereIsPoster = () => {
    this.swapiSerwice
      .getPoster(this.props.poster)
      .then((response) => {
        if (response.ok) {
          this.setState({
            poster: response.url,
            posterStatus: true,
          });
        }
      })
      .catch(this.errorPoster);
  };

  render() {
    const { name, date, description, id, genreID } = this.props;
    const { average, poster, error, posterStatus } = this.state;
    const antIcon = (
      <LoadingOutlined
        style={{
          fontSize: 45,
        }}
        spin
      />
    );
    const loadIcon = (
      <div className="spin__poster">
        <Spin indicator={antIcon} />
      </div>
    );
    let classAverage = 'average text';

    if (average <= 3) {
      classAverage += ' red';
    } else if (average > 3 && average <= 5) {
      classAverage += ' orange';
    } else if (average > 5 && average <= 7) {
      classAverage += ' yellow';
    } else if (average > 7) {
      classAverage += ' green';
    }

    const posterAndNotError = poster && !error;
    const posterImg = (
      <img
        className="movie_img"
        src={posterAndNotError ? poster : movieImage}
        alt="Не удалось загрузить картинку фильма, попробуйте еще раз :("
      />
    );
    return (
      <li className="movie" id={id}>
        {!posterStatus ? loadIcon : posterImg}
        <div className="movie_characteristics">
          <div className="movie_header">
            <h5 className="movie_name text">{Movie.textReduction(name, 3)}</h5>
            <div className={classAverage}>{average}</div>
          </div>
          <span className="movie_date text">{Movie.dataFormat(date)}</span>
          <Genre genreID={genreID} />
          <p className="movie_description text">{Movie.textReduction(description, 16)}</p>
          <Rate allowHalf value={average} count={10} className="rate" onChange={(e) => this.onRate(e)} />
        </div>
      </li>
    );
  }
}

Movie.defaultProps = {
  name: '',
  date: '',
  description: '',
  id: '',
  genreID: '',
};

Movie.propTypes = {
  name: PropTypes.string,
  date: PropTypes.string,
  description: PropTypes.string,
  id: PropTypes.node,
  genreID: PropTypes.node,
};
