import d3 from 'd3';
import _ from 'underscore';

import 'style!./graph-styles.scss';

export default class D3Graph {

	constructor(el, props = {}) {
		this.chart = el;
		const width = el.clientWidth;
		const height = el.clientHeight;
		const { compare } = props;
		const displayData = this.parseData(props);
		const key = (d) => d.city;

		this.margin = props.margin;
		this.xScale = d3.scale.ordinal()
			.rangeRoundBands([0, this.getChartSize().width], 0.05);
		this.yScale = d3.scale.linear()
			.range([this.getChartSize().height, 0]);

		const svg = d3.select(el).append('svg')
			.attr({
				height,
				width,
			});

		svg.append('defs').append('clipPath')
			.attr('id', 'chart-area')
			.append('rect')
				.attr({
					height: height,
					width: width,
					x: -props.margin.left,
					y: -props.margin.top - props.margin.bottom,
				});

		this.svg = svg.append('g')
		    .attr({
		    	transform: `translate(${this.margin.left}, ${this.margin.top})`,
		    	'clip-path': 'url(#chart-area)',
		    	id: 'bars',
		    });

		const axes = svg.append('g')
			.attr({
				transform: `translate(${this.margin.left}, ${this.margin.top})`,
			});

		axes.append('g')
			.attr('class', 'y axis');

		axes.append('g')
			.attr({
				class: 'x axis',
				transform: `translate(0, ${this.getChartSize().height})`,
			});

		this.createYLabel(compare);

	}
	
	update = (props) => {
		if (!props) return;
		
		const displayData = this.parseData(props);
		const { compare } = props;

		this.yScale.domain([0, d3.max(displayData, (d) => d.data)]);
		this.xScale.domain(displayData.map((result) => result.city));

		this.updateBars(displayData);
		this.updateLabels(displayData);

		const axes = this.createAxes(displayData, compare);
		
		d3.select('.x.axis')
			.transition()
			.duration(1000)
			.call(axes.x);

		d3.select('.y.axis')
			.transition()
			.duration(1000)
			.call(axes.y);

		const axisText = d3.select('.labelText');

		if (compare === 'estimates/price') {
			axisText.text('USD');
		} else if (compare === 'estimates/time') {
			axisText.text('Minutes');
		}

	}

	updateBars = (displayData) => {
		const chartSize = this.getChartSize();
		const key = (d) => d.city;
		const bars = this.svg.selectAll('rect')
			.data(displayData, key);

		bars.enter()
			.append('rect')
			.attr({
				class: 'bar',
				x: (d, i) => this.xScale(d.city),
				y: (d) => chartSize.height,
				width: this.xScale.rangeBand(),
				height: 0,
			});

		bars.transition()
			.duration(1000)
			.delay((d, i) => i / displayData.length * 500)
			.attr({
				x: (d, i) => this.xScale(d.city),
				y: (d) => this.yScale(d.data),
				width: this.xScale.rangeBand(),
				height: (d) => chartSize.height - this.yScale(d.data),
			});

		bars.exit()
			.transition()
			.duration(1000)
			.attr({
				height: 0,
				y: (d) => chartSize.height,
			})
			.remove();
	}

	updateLabels = (displayData) => {
		const chartSize = this.getChartSize();
		const key = (d) => d.city;
		const labels = this.svg.selectAll('text')
			.data(displayData, key);

		labels.enter()
			.append('text')
			.text((d) => d.airportCode + (d.multiAirport ? ' (+)' : ''))
			.attr({
				'text-anchor': 'middle',
				x: (d, i) => this.xScale(d.city) + this.xScale.rangeBand() / 2,
				y: (d) => chartSize.height + 25,
				'font-family': 'sans-serif',
				'font-size': '13px',
				'fill': 'white',
			});

		labels.transition()
			.duration(1000)
			.delay((d, i) => i / displayData.length * 500)
			.attr({
				y: (d) => this.yScale(d.data) + 25,
				x: (d, i) => this.xScale(d.city) + this.xScale.rangeBand() / 2,
			});

		labels.exit()
			.transition()
			.duration(1000)
			.attr({
				y: (d) => chartSize.height,
			})
			.remove();

	}

	createAxes = (displayData, compare) => {
		const xAxis = d3.svg.axis().scale(this.xScale).orient('bottom');
		const formatTime = d3.time.format('%M');
		const formatMinutes = (d) => formatTime(new Date(2012, 0, 1, 0, d));

		let yAxis;
		if (compare === 'estimates/price') {
			yAxis = d3.svg.axis().scale(this.yScale).orient('left').ticks(10, '$')
		} else if (compare === 'estimates/time') {
			yAxis = d3.svg.axis().scale(this.yScale).orient('left').tickFormat(formatMinutes);
		}

	    return {
	    	x: xAxis,
	    	y: yAxis,
	    };

	}

	createYLabel = (compare) => {
		let axisText = d3.select('.y.axis')
			.append('text');

		if (compare === 'estimates/price') {
			axisText.text('USD');
		} else if (compare === 'estimates/time') {
			axisText.text('Minutes');
		}

		const height = this.getChartSize().height;

    	axisText.attr({
			transform: 'rotate(-90)',
	  		y: -(this.margin.left / 2) - 5,
	  	    x: -(height / 2) - (axisText.node().getComputedTextLength() / 2),
	  	    class: 'labelText',
	  	    opacity: 0,
	    })
	    .transition()
	    .delay(2000)
	    .duration(1000)
	    .attr({
	    	opacity: 1,
	    });
	}

	getChartSize = () => {
		return {
			width: this.chart.clientWidth - this.margin.left - this.margin.right,
			height: this.chart.clientHeight - this.margin.top - this.margin.bottom,
		};
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
			current.airportCode = cityObject.data.currentAirport.code;
			current.multiAirport = cityObject.data.multiAirport;
			
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
		d3.selectAll('svg').remove();
	}
}