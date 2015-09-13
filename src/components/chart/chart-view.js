import React, { Component } from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { productList } from '../../config';

// Component styles
import styles from './chart.styles.js';

// Actions
import * as actionCreators from 'actions/chart-actions';

@connect(state => state.chart)
export default class Chart extends Component {
	constructor(props) {
		super(props);
		this.actions = bindActionCreators(actionCreators, this.props.dispatch);
	}

	componentDidMount() {
		this.actions.requestData({
			compare: this.props.compare,
			cities: this.props.cities
		});
	}

	buildCityList = () => {
		const { cities } = this.props;

		return (
			<select name='cities' ref='cityList' onChange={this.onCityChanged}>
				{cities.map((city) => <option value={city}>{city}</option>)}
			</select>
		);
	}

	buildProductList = () => {
		return (
			<select name='products' ref='productList' onChange={this.onProductChanged}>
				{productList.map((product) => <option value={product}>{product}</option>)}
			</select>
		);
	}

	onCityChanged = (e) => {
		console.log(e);
	}

	onProductChanged = (e) => {
		console.log(e);
	}

	render() {
		return (
			<div className={styles}>
				<h3>Redux test</h3>
				{this.buildCityList()}
				{this.buildProductList()}
			</div>
		);
	}
}

