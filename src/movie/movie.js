import React, { Component } from 'react';
import { Rate } from 'antd';
import './movie.css';
import PropTypes from 'prop-types';

import Genre from '../genre';
import SwapiService from '../services/swapi-service';

import movieImage from './movie.png';

export default class Movie extends Component {
  // сокращение текста
  static textReduction(text, wordCount) {
    if (typeof text !== 'undefined') {
      let arrText = text.split(' ');
      if (arrText.length >= wordCount + 1) {
        arrText = arrText.slice(0, wordCount);
        return `${arrText.join(' ')}...`;
      }
      return `${arrText.join(' ')}`;
    }
    return false;
  }

  // преобразование даты
  static dataFormat = (data) => {
    if (typeof data !== 'undefined') {
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
    }
    return false;
  };

  swapiSerwice = new SwapiService();

  constructor() {
    super();
    this.state = {
      average: 0,
      poster: null,
      error: false,
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
    let rateMoviesAll = JSON.parse(localStorage.getItem('rateMoviesAll'));
    if (rateMoviesAll.length === 0) {
      rateMoviesAll = rateMoviesAll.concat([{ id: this.props.id, rating: e }]);
    } else {
      // eslint-disable-next-line consistent-return
      const newArr = rateMoviesAll.some((elem, i) => {
        if (elem.id === this.props.id) {
          rateMoviesAll.splice(i, 1, { id: this.props.id, rating: e });
          return true;
        }
      });

      if (!newArr) {
        rateMoviesAll.push({ id: this.props.id, rating: e });
      }
    }
    localStorage.setItem('rateMoviesAll', JSON.stringify([...rateMoviesAll]));

    this.setState({
      average: e,
    });
  };

  // есть ли постер
  thereIsPoster = () =>
    this.swapiSerwice
      .getPoster(this.props.poster)
      .then((response) => {
        if (response.ok && response.url !== null) {
          this.setState({
            poster: response.url,
          });
        }
      })
      .catch(this.errorPoster);

  render() {
    const { name, date, description, id, genreID, overallRating } = this.props;
    const { average, poster, error } = this.state;

    let classAverage = 'average text';

    if (overallRating <= 3) {
      classAverage += ' red';
    } else if (overallRating > 3 && overallRating <= 5) {
      classAverage += ' orange';
    } else if (overallRating > 5 && overallRating <= 7) {
      classAverage += ' yellow';
    } else if (overallRating > 7) {
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
    const screen = window.screen.width >= 768 && window.screen.width < 1024;
    return (
      <li className="movie" id={id}>
        {posterImg}
        <div className="movie_characteristics">
          <div className="movie_header">
            <h5 className="movie_name text">{Movie.textReduction(name, 3)}</h5>
            <div className={classAverage}>{Math.floor(overallRating)}</div>
          </div>
          <span className="movie_date text">{Movie.dataFormat(date)}</span>
          <Genre genreID={genreID} />
          <p className="movie_description text">{Movie.textReduction(description, screen ? 40 : 16)}</p>
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
