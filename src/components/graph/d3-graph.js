import d3 from 'd3';

export default class D3Graph {

	constructor(el, props = {}) {
		//console.log(props);
		this.svg = d3.select(el).append('svg');
	}
	
	update(props) {
		if (!props) return;
		//console.log(props);
	}

	destroy() {

	}
}