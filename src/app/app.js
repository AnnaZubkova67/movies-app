import React, { Component } from 'react';
import { Alert, Pagination, Spin } from 'antd';
import { LoadingOutlined } from '@ant-design/icons';

import MoviesList from '../movies-list';
import NetworkState from '../network-state';
import Header from '../header';
import './app.css';
import SwapiService from '../services/swapi-service';
import { GenreProvider } from '../swapi-service-context';

import 'antd/dist/antd.css';

class App extends Component {
  swapiService = new SwapiService();

  constructor() {
    super();
    this.state = {
      moviesData: [],
      loading: true,
      error: false,
      network: true,
      valueInput: '',
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
    } else {
      await this.sessionId();
    }
    const time = Math.floor((Date.now() - this.state.timeSession) / (1000 * 60 * 60));
    if (time >= 12) {
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
      localStorage.setItem('pagIndexSearch', JSON.stringify(this.state.pagIndex));
      this.updateMovies();
    }
    if (this.state.pagIndex !== prevState.pagIndex && this.state.activeTabRate) {
      this.rateMovies();
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
    localStorage.setItem('moviesData', JSON.stringify(mov.results));
    localStorage.setItem('totalResults', JSON.stringify(mov.total_results));
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
      localStorage.setItem('moviesData', JSON.stringify(newArr.results));
      this.setState({
        moviesData: newArr.results,
        totalResults: newArr.total_results,
        loading: false,
      });
    });
  };

  // получение значения, которое пользователь вводит в поисковую строку
  searchMovies = (e) => {
    this.setState({
      valueInput: e.target.value,
      loading: true,
      pagIndex: 1,
    });
  };

  // получение ID сессии, если после его регистрации не прошло больше 12 часов
  sessionIDSave = () => {
    this.setState({
      sessionID: JSON.parse(localStorage.getItem('sessionID')),
      timeSession: JSON.parse(localStorage.getItem('timeSession')),
    });
  };

  // подключен ли пользователь к сети
  onNetworkState = () => {
    const { network } = this.state;
    if (network) {
      this.setState({ network: false });
    } else {
      this.setState({ network: true });
    }
  };

  // определение индекса пагинации
  pagination = (e) => {
    this.setState({
      pagIndex: e,
    });
  };

  //  клик на rate
  rateClick = () => {
    this.setState({
      activeTabRate: true,
      activeTabSearch: false,
      loading: true,
    });
    this.rateMovies().then(() => {
      this.setState({
        moviesData: JSON.parse(localStorage.getItem('moviesDataRate')),
        totalResults: JSON.parse(localStorage.getItem('totalResultsRate')),
      });
    });
  };

  // получение всего списка фильмов при клике на search
  searchClick = () => {
    this.setState({
      moviesData: JSON.parse(localStorage.getItem('moviesData')),
      activeTabRate: false,
      activeTabSearch: true,
      totalResults: JSON.parse(localStorage.getItem('totalResults')),
      pagIndex: JSON.parse(localStorage.getItem('pagIndexSearch')),
    });
  };

  // получение оцененных фильмов
  async rateMovies() {
    if (!this.state.activeTabRate) {
      await this.setState({
        pagIndex: 1,
      });
    }
    const { sessionID, pagIndex } = this.state;
    if (sessionID) {
      await this.swapiService.gerRating(sessionID, pagIndex).then(async (response) => {
        localStorage.setItem('moviesDataRate', JSON.stringify(response.results));
        localStorage.setItem('totalResultsRate', JSON.stringify(response.total_results));
        await this.setState({
          moviesData: JSON.parse(localStorage.getItem('moviesDataRate')),
          loading: false,
        });
      });
    }
  }

  // получение нового ID сессии
  async sessionId() {
    await this.swapiService.getSession().then(async (id) => {
      localStorage.setItem('moviesData', JSON.stringify(this.state.moviesData));
      localStorage.setItem('totalResults', JSON.stringify(this.state.totalResults));
      localStorage.setItem('sessionID', JSON.stringify(id));
      localStorage.setItem('timeSession', JSON.stringify(Date.now()));
      localStorage.setItem('rateMoviesAll', JSON.stringify([]));
      await this.setState({
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

    const errorElement = (
      <div className="error">
        <Alert
          message="Error"
          description="Что-то пошло не так, невозможно загрузить данные :("
          type="error"
          showIcon
        />
      </div>
    );

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

    const networkElement = (
      <div className="error">
        <Alert message="Error" description="Вы не подключены к сети :(" type="error" showIcon />
      </div>
    );

    const contentTag = (
      <>
        <MoviesList moviesData={moviesData} loading={loading} error={error} network={network} sessionID={sessionID} />
        <Pagination
          defaultPageSize={20}
          showSizeChanger={false}
          defaultCurrent={pagIndex}
          current={pagIndex}
          total={totalResults}
          className="pagination"
          onChange={(e) => this.pagination(e)}
        />
      </>
    );

    const spin = loading && !error ? loadIcon : null;
    const content = !loading ? contentTag : null;
    const networkMessage =
      (!network && !loading && moviesData.length !== 0) || (!network && !loading) ? networkElement : null;
    const errorMessage = error ? errorElement : null;

    return (
      <GenreProvider value={this.state.genre}>
        <section className="movies-app">
          <NetworkState onNetworkState={this.onNetworkState} />
          {networkMessage}
          <Header
            onSearchMovies={this.searchMovies}
            valueInput={valueInput}
            sessionID={sessionID}
            rateMovies={this.rateClick}
            searchClick={this.searchClick}
            activeTabSearch={activeTabSearch}
            activeTabRate={activeTabRate}
          />
          <div className="content">
            {content} {spin} {errorMessage}{' '}
          </div>
        </section>
      </GenreProvider>
    );
  }
}

export default App;
