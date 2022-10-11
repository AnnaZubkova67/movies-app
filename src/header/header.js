import React from 'react';
import { debounce } from 'lodash';
import PropTypes from 'prop-types';

import SearchPanel from '../search-panel';
import './header.css';
import Movie from '../movie';

function Header({ searchClick, activeTabSearch, rateMovies, valueInput, onSearchMovies, activeTabRate }) {
  const debouncedSearch = debounce(onSearchMovies, 1000);
  const searchPanel = <SearchPanel onSearchMovies={debouncedSearch} valueInput={valueInput} />;
  return (
    <>
      <div className="tabs">
        <button
          type="button"
          className={activeTabSearch ? 'tabs__button text active' : 'tabs__button text'}
          onClick={searchClick}
        >
          Search
        </button>
        <button
          type="button"
          className={activeTabRate ? 'tabs__button text active' : 'tabs__button text'}
          onClick={rateMovies}
        >
          Rated
        </button>
      </div>
      {activeTabSearch ? searchPanel : null}
    </>
  );
}

export default Header;

Movie.defaultProps = {
  searchClick: () => {},
  activeTabSearch: true,
  rateMovies: () => {},
  valueInput: '',
  onSearchMovies: () => {},
  activeTabRate: false,
};

Movie.propTypes = {
  searchClick: PropTypes.func,
  activeTabSearch: PropTypes.bool,
  rateMovies: PropTypes.func,
  valueInput: PropTypes.string,
  onSearchMovies: PropTypes.func,
  activeTabRate: PropTypes.bool,
};
