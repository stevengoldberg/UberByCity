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

	handleSubmit = () => {
		const newCity = this.refs.cityInput.value;
		const { addCity } = this.props;
		addCity(newCity);
	}

	render() {
		const { cities } = this.props;

		return (
			<div className={styles.container}>
				<form>
					<input className={styles.input} ref='cityInput' placeholder='Add City'></input>
					<button type='button' onClick={this.handleSubmit}>Submit</button>
				</form>

				<ul ref='cityList' className={styles.cityList}>
					{cities.map((city, i) => <li key={i} ref={city}><span className={styles.cityListClose} onClick={this.handleRemove.bind(this, city)}>x</span>
						<span className={styles.cityListItem}>{city}</span>
					</li>)}
				</ul>
			</div>
		);
	}
}

