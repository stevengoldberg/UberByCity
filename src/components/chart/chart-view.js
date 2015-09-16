import React, { Component } from 'react';
import assign from 'object-assign';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { productList, comparisonList } from '../../config';

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
		this.inputError = false;
	}

	componentDidMount() {
		this.actions.requestData({
			compare: this.props.compare,
			cities: this.props.cities
		});
	}

	addCity = (city) => {
		const cities = [city];
		this.actions.requestData({
			compare: this.props.compare,
			cities,
		});
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
			<select name='comparison' ref='comparisonList' onChange={this.onComparisonChanged}>
				{comparisonList.map((comparison, i) => <option value={comparison.value} key={i}>{comparison.name}</option>)}
			</select>
		);
	}

	onProductChanged = () => {
		console.log(this.refs.productList.value);
	}

	onComparisonChanged = () => {
		this.actions.changeComparison(this.refs.comparisonList.value);
	}

	render() {
		return (
			<div>
				<div className={styles.container}>
					<CityList
						cities={this.props.cities}
						graphData={this.props.graphData}
						removeCity={this.actions.removeCity}
						addCity={this.addCity}
						showError={this.props.cityError}
						loading={this.props.loading}
					/>
				</div>
				<div className={styles.container}>
					{this.buildCompareList()}
					{this.buildProductList()}
				</div>
			</div>
		);
	}
}

