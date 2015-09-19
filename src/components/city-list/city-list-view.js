import React, { Component } from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';

import { Spinner, Button } from '../../components';

// Component styles
import styles from './city-list.styles.js';

export default class CityList extends Component {
	constructor(props) {
		super(props);
	}

	handleRemove = (city) => {
		const { removeCity, canRemove } = this.props;
		if(canRemove) {
			removeCity(city);
		}
	}

	handleSubmit = (e) => {
		e.preventDefault();
		const newCity = this.refs.cityInput.value;
		const { addCity } = this.props;
		addCity(newCity);
		this.refs.cityInput.value = '';
	}

	disableSubmit = () => {
		return this.refs.cityInput.value === '' || this.props.loading;
	}

	render() {
		const { cities } = this.props;

		return (
			<div className={styles.container}>
				<form onSubmit={this.handleSubmit}>
					<input
						className={this.props.showError ? styles.inputError : styles.input}
						ref='cityInput' 
						placeholder='Add City'
					>
					</input>
					<Button
						label='Submit'
						onClick={this.handleSubmit}
					/>
					<Spinner show={this.props.loading}/>
				</form>

				<ul ref='cityList' className={styles.cityList}>
					{cities.map((city, i) => <li key={i} ref={city}>
						<span className={this.props.canRemove ? styles.cityListClose : styles['cityListClose-disabled']} onClick={this.handleRemove.bind(this, city)}>
							x
						</span>
						<span className={this.props.erroredCities.indexOf(city) > -1 ? styles.cityListItemError : styles.cityListItem}>
							{city}
						</span>
					</li>)}
				</ul>
			</div>
		);
	}
}

