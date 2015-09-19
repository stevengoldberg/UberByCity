import d3 from 'd3';
import _ from 'underscore';

import 'style!./graph-styles.scss';

export default class D3Graph {

	constructor(el, props = {}) {
		this.chart = el;
		const width = el.clientWidth;
		const height = el.clientHeight;
		const displayData = this.parseData(props);
		this.margin = props.margin;

		this.lastData = displayData;
		this.svg = d3.select(el).append('svg')
			.attr({
				height,
				width,
			})
		  .append('g')
		    .attr({
		    	transform: `translate(${this.margin.left}, ${this.margin.top})`,
		    });
	}
	
	update = (props) => {
		if (!props) return;
		const displayData = this.parseData(props);
		const { compare } = props;

		this.xScale = d3.scale.ordinal()
			.rangeRoundBands([0, this.getChartSize().width], 0.1);
		this.yScale = d3.scale.linear()
			.range([this.getChartSize().height, 0]);

		this.drawBars(displayData);
		this.drawAxes(displayData, compare);
		//this.lastData = displayData;
	}

	drawBars = (displayData) => {
		const chartSize = this.getChartSize();

		this.yScale.domain([0, d3.max(displayData, (d) => d.data)]);
		this.xScale.domain(displayData.map((result) => result.city));

		this.clearChart();

		const bars = this.svg.selectAll('rect')
			.data(displayData)
			.enter()
			.append('rect')
			.attr({
				class: 'bar',
				x: (d, i) => this.xScale(d.city),
				y: (d) => this.yScale(d.data),
				width: this.xScale.rangeBand(),
				height: (d) => chartSize.height - this.yScale(d.data),
				fill: 'black',
			});
	}

	drawAxes = (displayData, compare) => {
		d3.selectAll('.axis').remove();
		const xAxis = d3.svg.axis().scale(this.xScale).orient('bottom');
		const formatTime = d3.time.format('%M');
		const formatMinutes = (d) => formatTime(new Date(2012, 0, 1, 0, d));


		let yAxis;
		if (compare === 'estimates/price') {
			yAxis = d3.svg.axis().scale(this.yScale).orient('left').ticks(10, '$')
		} else if (compare === 'estimates/time') {
			yAxis = d3.svg.axis().scale(this.yScale).orient('left').tickFormat(formatMinutes);
		}
		this.svg.append('g')
			.attr('class', 'y axis')
			.call(yAxis);

		let axisText = d3.select('.y.axis')
			    .append('text');

		if (compare === 'estimates/price') {
			axisText.text('USD');
		} else if (compare === 'estimates/time') {
			axisText.text('Minutes');
		}

      	axisText.attr({
		  	transform: 'rotate(-90)',
	  	    y: -(this.margin.left / 2) - 5,
	  	    x: -(d3.select('.y.axis').node().getBBox().height / 2) - (axisText.node().getComputedTextLength() / 2),
	  	    class: 'labelText',
	    });

		this.svg.append('g')
			.attr({
				class: 'x axis',
				transform: `translate(0, ${this.getChartSize().height})`,
			})
			.call(xAxis);
	}

	getChartSize = () => {
		return {
			width: this.chart.clientWidth - this.margin.left - this.margin.right,
			height: this.chart.clientHeight - this.margin.top - this.margin.bottom,
		};
	}

	clearChart = () => {
		d3.selectAll('rect').remove();
	}

	parseData = (props) => {
		const { graphData, display, compare } = props;
		let currentData = [];

		graphData.forEach((cityObject) => {
			let current = {};
			const response = _.find(cityObject.data.data, (data) => 
				data['display_name'].toLowerCase().trim() === display.toLowerCase());

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
		// Average price estimate
		return response ? (response.high_estimate + response.low_estimate) / 2 : null;
	}

	parseTime = (response) => {
		// Convert ETA to minutes
		return response ? response.estimate / 60 : null;
	}

	destroy() {

	}
}