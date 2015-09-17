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
		graphData: PropTypes.array.isRequired,
		displayProduct: PropTypes.string.isRequired,
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
			<div className={styles.selectContainer}>
				<label for='products'>Product Type</label>
				<select name='products' ref='productList' onChange={this.onProductChanged} disabled={this.props.loading}>
					{productList.map((product, i) => <option value={product} key={i}>{product}</option>)}
				</select>
			</div>
		);
	}

	buildCompareList = () => {
		return (
			<div className={styles.selectContainer}>
				<label for='comparison'>Data Type</label>
				<select name='comparison' ref='comparisonList' onChange={this.onComparisonChanged} disabled={this.props.loading}>
					{comparisonList.map((comparison, i) => <option value={comparison.value} key={i}>{comparison.name}</option>)}
				</select>
			</div>
		);
	}

	buildHeadline = () => {
		const { compare } = this.props;
		const headline = compare === 'estimates/time' ? 'How long will it take to get an Uber at the airport?' :
			compare === 'estimates/price' ? 'How much will an Uber ride from the airport to the city center cost?' : null;

		return (
			<h1>{headline}</h1>
		);
	}

	onProductChanged = () => {
		this.actions.changeDisplayProduct(this.refs.productList.value);
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
					{this.buildHeadline()}
				</div>
				<div ref='graph' className={styles.graph}></div>
			</div>
		);
	}
}
