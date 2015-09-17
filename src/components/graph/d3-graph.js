import d3 from 'd3';
import _ from 'underscore';

export default class D3Graph {

	constructor(el, props = {}) {
		const width = el.clientWidth;
		const height = el.clientHeight;

		const displayData = this.parseData(props);
		console.log(displayData);

		this.svg = d3.select(el).append('svg')
			.attr({
				height,
				width,
			});
	}
	
	update = (props) => {
		if (!props) return;
		const displayData = this.parseData(props);
		console.log(displayData);
	}

	parseData = (props) => {
		const { graphData, display, compare } = props;
		let currentData = [];

		graphData.forEach((cityObject) => {
			let current = {};
			const response = _.find(cityObject.data.data, (data) => 
				data['display_name'].toLowerCase() === display.toLowerCase());

			if (compare === 'estimates/price') {
				current.data = this.parsePrice(response);
			} else if (compare === 'estimates/time') {
				current.data = this.parseTime(response);
			}

			current.city = cityObject.city;
			
			if (current.data) {
				currentData.push(current);
			}
		}, this);
		
		return currentData;
	}

	parsePrice = (response) => {
		return response ? (response.high_estimate + response.low_estimate) / 2 : null;
	}

	parseTime = (response) => {
		return response ? response.estimate : null;
	}

	destroy() {

	}
}