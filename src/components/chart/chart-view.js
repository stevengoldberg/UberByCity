import React, { Component } from 'react';
import assign from 'object-assign';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { productList, comparatorList } from '../../config';

// Component styles
import styles from './chart.styles.js';

// Actions
import * as chartActions from '../../actions/chart-actions';
import * as cityActions from '../../actions/city-list-actions';

// Components
import { CityList } from '../../components';

@connect(state => state.chart)
export default class Chart extends Component {
	constructor(props) {
		super(props);
		const actionCreators = assign({}, chartActions, cityActions);
		this.actions = bindActionCreators(actionCreators, this.props.dispatch);
	}

	componentDidMount() {
		this.actions.requestData({
			compare: this.props.compare,
			cities: this.props.cities
		});
	}

	componentDidUpdate(prevProps) {
		if(prevProps.cities.length !== this.props.cities.length || prevProps.compare !== this.props.compare) {
			this.actions.requestData({
				compare: this.props.compare,
				cities: this.props.cities
			});
		}
	}

	buildProductList = () => {
		return (
			<select name='products' ref='productList' onChange={this.onProductChanged}>
				{productList.map((product, i) => <option value={product} key={i}>{product}</option>)}
			</select>
		);
	}

	buildCompareList = () => {
		return (
			<select name='comparators' ref='compareList' onChange={this.onComparatorChanged}>
				{comparatorList.map((comparator, i) => <option value={comparator.value} key={i}>{comparator.name}</option>)}
			</select>
		);
	}

	onCityChanged = () => {
		console.log(this.refs.cityList.value);
	}

	onProductChanged = () => {
		console.log(this.refs.productList.value);
	}

	onComparatorChanged = () => {
		console.log(this.refs.compareList.value);
	}

	render() {
		return (
			<div className={styles.container}>
				<CityList
					cities={this.props.cities}
					removeCity={this.actions.removeCity}
					addCity={this.actions.addCity}
				/>
				{this.buildProductList()}
				{this.buildCompareList()}
			</div>
		);
	}
}

