import React, { Component, PropTypes } from 'react';
import assign from 'object-assign';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { productList, comparisonList } from '../../config';

// Component styles
import styles from './controls.styles.js';

// Actions
import * as chartActions from '../../actions/chart-actions';
import * as cityActions from '../../actions/city-list-actions';

// Components
import { CityList, Header, D3Graph } from '../../components';

@connect(state => state.chart)
export default class Chart extends Component {
	constructor(props) {
		super(props);
		const actionCreators = assign({}, chartActions, cityActions);
		this.actions = bindActionCreators(actionCreators, this.props.dispatch);
		this.D3Graph = null;
	}

	static propTypes = {
		compare: PropTypes.string.isRequired,
		cities: PropTypes.array.isRequired,
	}

	componentDidMount() {
		this.actions.requestData({
			compare: this.props.compare,
			cities: this.props.cities
		});

		this.D3Graph = new D3Graph(this.refs.graph, this.getChartState());
	}

	componentDidUpdate() {
		this.D3Graph.update(this.getChartState());
	}

	getChartState() {
		return {
			graphData: this.props.graphData,
			compare: this.props.compare,
			display: this.props.displayProduct, 
		};
	}

	componentWillUnmount() {
		//this.D3Graph.destroy(this.refs.graph);
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
		this.actions.requestData({
			compare: this.refs.comparisonList.value,
			cities: this.props.cities,
			reset: true,
		});
	}

	render() {
		return (
			<div>
				<Header />
				<div className={styles.container}>
					<CityList
						cities={this.props.cities}
						graphData={this.props.graphData}
						removeCity={this.actions.removeCity}
						addCity={this.addCity}
						showError={this.props.cityError}
						loading={this.props.loading}
						canRemove={this.props.cities.length > 1}
					/>
					{this.buildCompareList()}
					{this.buildProductList()}
				</div>
				<div ref='graph' className={styles.graph}></div>
			</div>
		);
	}
}
