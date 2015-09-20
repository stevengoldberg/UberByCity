import React, { Component, PropTypes } from 'react';

import { Button } from '../../components';

// Component styles
import styles from './refresh.styles.js';

export default class Refresh extends Component {
	static propTypes = {
		refreshTime: PropTypes.string.isRequired,
	}

	secondOrSeconds = () => {
		const { countdown } = this.props;
		return countdown === 1 ? 'second' : 'seconds';
	}

	render() {
		return (
			<div className={styles.container}>
				<span className={styles.refresh}>Last updated at <span className={styles.time}>{this.props.refreshTime}</span>.</span>
				<span className={styles.refresh}>Auto-updating in <span className={styles.time}>{this.props.countdown}</span> {this.secondOrSeconds()}.</span>
			</div>
		);
	}
}
