String.prototype.repeat = function(length) {
	return Array(length + 1).join(this);
};

class AsciiGraph {
	constructor(data, options) {
		this.data = data;
		
		this.dataChar = options['dataChar'];
		this.axisChar = options['axisChar'];
		this.blankChar = options['blankChar'];

		this.yScale = options['yScale'];
	}

	output() {
		// find max value
		let max = 0;
		for (let i = 0; i < this.data.length; i++) 
			if (this.data[i] > max) max = this.data[i];

		// generate rows
		let rows = [];
		let row = max;
		let marginLeft = max.toString().length;


		for (let i = max / this.yScale - 1; i > 0; i--) { 
			if (i != max / this.yScale - 1) row += ' '.repeat(marginLeft);
			row += this.axisChar // add axis
			for (let j = 0; j < this.data.length; j++) {
				// add value
				if (this.data[j] / this.yScale >= i) row += this.dataChar;
				// add space if no value here
				else row += this.blankChar;
			}

			rows.push(row);
			row = '';
		}

		// lower axis
		row = ' '.repeat(marginLeft - 1) + '0' + this.axisChar.repeat(this.data.length + 1);
		rows.push(row);

		return rows.join('\n');
	}
};

module.exports = AsciiGraph;