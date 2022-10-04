import React, { Component } from 'react';
import { Pagination } from 'antd';

import MoviesList from '../movies-list';
import NetworkState from '../network-state';
import Header from '../header';
import './app.css';
import SwapiService from '../services/swapi-service';
import { SwapiServiceProvider } from '../swapi-service-context';

class App extends Component {
  swapiService = new SwapiService();

  constructor() {
    super();
    this.state = {
      moviesData: [],
      loading: true,
      error: false,
      network: true,
      valueInput: undefined,
      pagIndex: 1,
      genre: [],
      sessionID: '',
      timeSession: '',
      activeTabRate: false,
      activeTabSearch: true,
      totalResults: 0,
    };
  }

  async componentDidMount() {
    this.getListMovies(this.state.valueInput);
    if (localStorage.getItem('sessionID')) {
      await this.sessionIDSave();
      await this.rateMovies();
    } else {
      await this.sessionId();
    }
    const time = Math.floor((Date.now() - this.state.timeSession) / (1000 * 60 * 60));
    if (time >= 1) {
      localStorage.clear();
      await this.sessionId();
    }
    await this.onGenres();
  }

  componentDidUpdate(prevProps, prevState) {
    if (
      this.state.valueInput !== prevState.valueInput ||
      (this.state.pagIndex !== prevState.pagIndex && this.state.activeTabSearch)
    ) {
      this.updateMovies();
    }
  }

  // получение списка жанров
  async onGenres() {
    const genreList = [];
    await this.swapiService.getGenre().then((genre) => {
      genre.forEach((item) => genreList.push(item));
    });
    this.setState({
      genre: genreList,
    });
  }

  // загрузка фильмов с сервера завершена успешно
  onMoviesLoaded = (mov) => {
    this.setState({
      moviesData: mov.results,
      loading: false,
      error: false,
      totalResults: mov.total_results,
    });
  };

  // ошибка при загрузке данных с сервера
  onError = () => {
    this.setState({
      error: true,
    });
  };

  // запрос на получение списка фильмов
  getListMovies() {
    this.swapiService.getAllMovies().then(this.onMoviesLoaded).catch(this.onError);
  }

  // получение списка фильмов
  updateMovies = () => {
    const { valueInput, pagIndex } = this.state;
    this.swapiService.getAllMovies(valueInput, pagIndex).then((newArr) => {
      this.setState({
        moviesData: newArr.results,
        totalResults: newArr.total_results,
      });
    });
  };

  // получение значения, которое пользователь вводит в поисковую строку
  searchMovies = (e) => {
    this.setState({
      valueInput: e.target.value,
    });
  };

  // получение ID сессии, если после его регистрации не прошло больше 24 часов
  sessionIDSave = () => {
    this.setState({
      sessionID: JSON.parse(localStorage.getItem('sessionID')),
      timeSession: JSON.parse(localStorage.getItem('timeSession')),
    });
  };

  // подключен ли пользователь к сети
  onNetworkState = () => {
    this.setState((network) => ({ network: !network }));
  };

  // определение индекса пагинации
  pagination = (e) => {
    this.setState({
      pagIndex: e,
    });
  };

  // получение оцененных фильмов при клике на rate
  rateClick = () => {
    this.rateMovies().then(() => {
      this.setState({
        moviesData: JSON.parse(localStorage.getItem('moviesDataRate')),
        activeTabRate: true,
        activeTabSearch: false,
        totalResults: JSON.parse(localStorage.getItem('totalResultsRate')),
      });
    });
  };

  // получение всего списка фильмов при клике на search
  searchClick = () => {
    this.getListMovies();
    this.setState({
      activeTabRate: false,
      activeTabSearch: true,
      pagIndex: 1,
      valueInput: undefined,
    });
  };

  // получение оцененных фильмов
  async rateMovies() {
    const { sessionID, pagIndex } = this.state;
    if (sessionID) {
      await this.swapiService.gerRating(sessionID, pagIndex).then(async (response) => {
        localStorage.setItem('moviesDataRate', JSON.stringify(response.results));
        localStorage.setItem('totalResultsRate', JSON.stringify(response.total_results));
      });
    }
  }

  // получение нового ID сессии
  async sessionId() {
    await this.swapiService.getSession().then((id) => {
      localStorage.setItem('sessionID', JSON.stringify(id));
      localStorage.setItem('timeSession', JSON.stringify(Date.now()));
      this.setState({
        sessionID: id,
        timeSession: Date.now(),
      });
    });
  }

  render() {
    const {
      moviesData,
      loading,
      error,
      network,
      valueInput,
      pagIndex,
      sessionID,
      activeTabRate,
      activeTabSearch,
      totalResults,
    } = this.state;

    return (
      <SwapiServiceProvider value={this.state.genre}>
        <section className="movies-app">
          <section className="main">
            <Header
              onSearchMovies={this.searchMovies}
              valueInput={valueInput}
              sessionID={sessionID}
              rateMovies={this.rateClick}
              searchClick={this.searchClick}
              activeTabSearch={activeTabSearch}
              activeTabRate={activeTabRate}
            />
            <MoviesList
              moviesData={moviesData}
              loading={loading}
              error={error}
              network={network}
              sessionID={sessionID}
            />
            <Pagination
              defaultPageSize={20}
              showSizeChanger={false}
              defaultCurrent={pagIndex}
              total={totalResults}
              className="pagination"
              onChange={(e) => this.pagination(e)}
            />
            <NetworkState onNetworkState={this.onNetworkState} />
            <div className="content"> </div>
          </section>
        </section>
      </SwapiServiceProvider>
    );
  }
}

export default App;
