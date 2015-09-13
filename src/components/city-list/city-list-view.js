import React, { Component } from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';

// Component styles
import styles from './city-list.styles.js';

export default class CityList extends Component {
	constructor(props) {
		super(props);
	}

	componentDidMount() {
		
	}

	handleRemove = (city) => {
		const { removeCity } = this.props;
		removeCity(city);
	}

	render() {
		const { cities } = this.props;

		return (
			<ul ref='cityList' className={styles.cityList}>
				{cities.map((city, i) => <li key={i} ref={city}><span className={styles.cityListClose} onClick={this.handleRemove.bind(this, city)}>x</span>
					<span className={styles.cityListItem}>{city}</span>
				</li>)}
			</ul>
		);
	}
}

