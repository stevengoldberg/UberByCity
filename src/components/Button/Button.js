import React, { Component, PropTypes } from 'react';

// Component styles
import styles from './Button.styles.js';

export default class Button extends Component {
	static propTypes = {
		label: PropTypes.string,
		onClick: PropTypes.func,
		disabled: PropTypes.bool,
	}

	render() {
		return (
			<button className={styles.button} type='button' onClick={this.props.onClick} disabled={this.props.disabled}>
				{this.props.label}
			</button>
		);
	}
}
