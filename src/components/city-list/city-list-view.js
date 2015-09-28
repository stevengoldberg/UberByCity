import React, { Component } from 'react';
import classnames from 'classnames';

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

	getCityClass = (city) => {
		return classnames({
			[styles.cityListItem]: true,
			[styles.cityListItemError]: this.props.erroredCities.indexOf(city) > -1,
			[styles.cityListItemShown]: this.props.citiesOnChart.indexOf(city) > -1,

		});
	}

	render() {
		const { cities } = this.props;
		const inputClass = classnames({
			[styles.input]: true,
			'form-control': true,
			[styles.inputError]: this.props.showError,
		});
		const containerClass = classnames({
			[styles.container]: true,
			'form-group': true,
			'has-error': this.props.showError,
		});

		return (
			<div className={containerClass}>
				<form onSubmit={this.handleSubmit}>
					<input
						className={inputClass}
						ref='cityInput' 
						placeholder='Enter City Name'
						type='text'
					>
					</input>
					<Button
						label='Submit'
						onClick={this.handleSubmit}
						disabled={this.props.loading}
						showError={this.props.showError}
					/>
					<Spinner show={this.props.loading}/>
				</form>

				<ul ref='cityList' className={styles.cityList}>
					{cities.map((city, i) => <li key={i} ref={city.name}>
						<span className={this.props.canRemove ? styles.cityListClose : styles['cityListClose-disabled']} onClick={this.handleRemove.bind(this, city.name)}>
							<i className='fa fa-times-circle'></i>
						</span>
						<span className={this.getCityClass(city.name)}>
							{city.name}
						</span>
					</li>)}
				</ul>
			</div>
		);
	}
}

