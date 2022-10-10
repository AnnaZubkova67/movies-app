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

  change = (e) => {
    this.props.onSearchMovies(e);
    this.setState({
      value: e.target.value,
    });
  };

  render() {
    const { value } = this.state;
    return (
      <input
        type="text"
        name="text"
        className="search text"
        placeholder="Type to search..."
        onChange={this.change}
        value={value}
      />
    );
  }
}

SearchPanel.defaultProps = {
  valueInput: '',
};

SearchPanel.propTypes = {
  valueInput: PropTypes.node,
};
