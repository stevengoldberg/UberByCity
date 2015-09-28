import React, { Component, PropTypes } from 'react';
import * as config from 'config';

// Component styles
import styles from './controls.styles.js';

// Components
import { CityList, Header, D3Graph, Refresh } from '../../components';

export default class Controls extends Component {
	constructor(props) {
		super(props);
		this.D3Graph = null;
		this.timer = null;
	}

	static propTypes = {
		addCity: PropTypes.func.isRequired,
		removeCity: PropTypes.func.isRequired,
		countdownTick: PropTypes.func.isRequired,
		changeDisplayProduct: PropTypes.func.isRequired,
		changeComparison: PropTypes.func.isRequired,
		requestNewAirport: PropTypes.func.isRequired,
	}

	componentDidMount() {
		this.D3Graph = new D3Graph(this.refs.graph, this.getChartState(), this.props.requestNewAirport);
		this.timer = setInterval(this.props.countdownTick, 1000);
	}

	componentDidUpdate(prevProps) {
		if ((prevProps.loading === true && this.props.loading === false) || prevProps.displayProduct !== this.props.displayProduct) {
			this.D3Graph.update(this.getChartState());
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

	buildProductList = () => {
		return (
			<div className={styles.selectLeft}>
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
			return (
				<h4>
					<span className={styles.emphasize}>How long will it take</span> to get an <span className={styles.emphasize}>{this.props.displayProduct}</span> at the airport?
				</h4>)
		} else if (compare === 'estimates/price') {
			return (
				<h4>
					<span className={styles.emphasize}>What will it cost</span> to take an <span className={styles.emphasize}>{this.props.displayProduct}</span> from the airport to the city center?
				</h4>);
		}
	}

	onProductChanged = () => {
		this.props.changeDisplayProduct(this.refs.productList.value);
	}

	onComparisonChanged = () => {
		this.props.changeComparison(this.refs.comparisonList.value);
	}

	render() {
		return (
			<div>
				<Header />
				<div className={styles.controlsContainer}>
					<div className={styles.container}>
						<CityList
							cities={this.props.cities}
							erroredCities={this.props.erroredCities}
							graphData={this.props.graphData}
							showError={this.props.cityError}
							loading={this.props.loading}
							canRemove={this.props.cities.length > 1}
							citiesOnChart={this.props.citiesOnChart}
							removeCity={this.props.removeCity}
							addCity={this.props.addCity}
						/>
					</div>
					<div className={styles.selectContainer}>
						{this.buildProductList()}
						{this.buildCompareList()}
					</div>
				</div>
				<div ref='graph' className={styles.graph}>
					{this.buildHeadline()}
					<Refresh 
						refreshTime={this.props.refreshTime} 
						countdown={this.props.countdown}
						loading={this.props.loading}
					/>
				</div>
			</div>
		);
	}
}
