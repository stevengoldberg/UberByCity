import React, { Component, PropTypes } from 'react';
import assign from 'object-assign';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import * as config from 'config';

// Component styles
import styles from './controls.styles.js';

// Actions
import * as chartActions from '../../actions/chart-actions';
import * as cityActions from '../../actions/city-list-actions';

// Components
import { CityList, Header, D3Graph, Refresh } from '../../components';

@connect(state => state.chart)
export default class Chart extends Component {
	constructor(props) {
		super(props);
		const actionCreators = assign({}, chartActions, cityActions);
		this.actions = bindActionCreators(actionCreators, this.props.dispatch);
		this.D3Graph = null;
		this.timer = null;
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
			cities: this.props.cities,

		});

		this.D3Graph = new D3Graph(this.refs.graph, this.getChartState());
		//this.timer = setInterval(this.actions.countdownTick, 1000);
	}

	componentDidUpdate(prevProps) {
		if ((prevProps.loading === true && this.props.loading === false) || prevProps.displayProduct !== this.props.displayProduct) {
			this.D3Graph.update(this.getChartState());
		}
		if(this.props.countdown === 0) {
			this.actions.requestData({
				compare: this.props.compare,
				cities: this.props.cities,
			});
		}
	}

	getChartState() {
		return {
			graphData: this.props.graphData,
			compare: this.props.compare,
			display: this.props.displayProduct,
			margin: {
				top: 20,
				right: 20,
				bottom: 30,
				left: 60,
			},
		};
	}

	componentWillUnmount() {
		this.D3Graph.destroy(this.refs.graph);
		clearInterval(this.timer);
	}

	addCity = (city) => {
		if(this.props.cities.indexOf(city) === -1) {
			const cities = [city];
			this.actions.requestData({
				compare: this.props.compare,
				cities,
			});
		} else {
			this.actions.dataError(city);
		}
		
	}

	buildProductList = () => {
		return (
			<div className={styles.selectContainer}>
				<label htmlFor='products'>Product Type</label>
				<select id='products' ref='productList' onChange={this.onProductChanged} disabled={this.props.loading}>
					{config.productList.map((product, i) => <option value={product} key={i}>{product}</option>)}
				</select>
			</div>
		);
	}

	buildCompareList = () => {
		return (
			<div className={styles.selectContainer}>
				<label htmlFor='comparison'>Data Type</label>
				<select id='comparison' ref='comparisonList' onChange={this.onComparisonChanged} disabled={this.props.loading}>
					{config.comparisonList.map((comparison, i) => <option value={comparison.value} key={i}>{comparison.name}</option>)}
				</select>
			</div>
		);
	}

	buildHeadline = () => {
		const { compare } = this.props;

		if(compare === 'estimates/time'){
			return (<h1><span className={styles.emphasize}>How long will it take</span> to get an <span className={styles.emphasize}>{this.props.displayProduct}</span> at the airport?</h1>)
		} else if (compare === 'estimates/price') {
			return (<h1><span className={styles.emphasize}>How much will it cost</span> to take an <span className={styles.emphasize}>{this.props.displayProduct}</span> from the airport to the city center?</h1>);
		}
	}

	onProductChanged = () => {
		this.actions.changeDisplayProduct(this.refs.productList.value);
	}

	onComparisonChanged = () => {
		this.actions.requestData({
			compare: this.refs.comparisonList.value,
			cities: this.props.cities,
			reset: 'graph',
		});
	}

	render() {
		return (
			<div>
				<Header />
				<div className={styles.outerContainer}>
					<div className={styles.container}>
						<CityList
							cities={this.props.cities}
							erroredCities={this.props.erroredCities}
							graphData={this.props.graphData}
							removeCity={this.actions.removeCity}
							addCity={this.addCity}
							showError={this.props.cityError}
							loading={this.props.loading}
							canRemove={this.props.cities.length > 1}
							citiesOnChart={this.props.citiesOnChart}
						/>
					</div>
					<div className={styles.container}>
						<Refresh 
							refreshTime={this.props.refreshTime} 
							refreshData={this.actions.requestData.bind(this, {
								compare: this.props.compare,
								cities: this.props.cities,
							})}
							countdown={this.props.countdown}
						/>
						{this.buildCompareList()}
						{this.buildProductList()}
					</div>
					{this.buildHeadline()}
				</div>
				<div ref='graph' className={styles.graph}></div>
			</div>
		);
	}
}
