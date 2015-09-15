import React, { Component } from 'react';

// Component styles
import styles from './styles.js';

export default class Spinner extends Component {
  render() {
    return (
      <i className={`fa fa-spinner fa-spin ${this.props.show ? '' : styles.hidden}`}></i>
    );
  }
}
