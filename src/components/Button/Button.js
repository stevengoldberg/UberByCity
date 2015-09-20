import React, { Component, PropTypes } from 'react';
import classnames from 'classnames';

// Component styles
import styles from './Button.styles.js';

export default class Button extends Component {
	static propTypes = {
		label: PropTypes.string,
		onClick: PropTypes.func,
		disabled: PropTypes.bool,
	}

	render() {
		const btnClass = classnames({
			'btn btn-primary': true,
			'btn-danger': this.props.showError,
			[styles.button]: true,
		});

		return (
			<button className={btnClass} type='button' onClick={this.props.onClick} disabled={this.props.disabled}>
				{this.props.label}
			</button>
		);
	}
}
