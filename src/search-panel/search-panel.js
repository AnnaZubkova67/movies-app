import React, { Component } from 'react';
import './search-panel.css';
import PropTypes from 'prop-types';

export default class SearchPanel extends Component {
  constructor(props) {
    super(props);
    this.state = {
      value: this.props.valueInput,
    };
  }

  render() {
    const { value } = this.state;
    return (
      <form>
        <input
          type="text"
          className="search text"
          placeholder="Type to search..."
          onChange={this.props.onSearchMovies}
          value={value}
        />
      </form>
    );
  }
}

SearchPanel.defaultProps = {
  valueInput: '',
};

SearchPanel.propTypes = {
  valueInput: PropTypes.node,
};
