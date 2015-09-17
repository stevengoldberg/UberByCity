import React, { Component, PropTypes } from 'react';

// Component styles
import styles from './refresh.styles.js';

export default class Refresh extends Component {
	static propTypes = {
		refreshTime: PropTypes.string.isRequired,
	}

	render() {
		return (
			<div className={styles.container}>
				<span className={styles.refresh}>Last refreshed at <span className={styles.time}>{this.props.refreshTime}</span>.</span>
				<button className={styles.refresh} onClick={this.props.refreshData}>Refresh</button>
			</div>
		);
	}
}
