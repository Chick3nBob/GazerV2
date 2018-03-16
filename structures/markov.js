Array.prototype.choice = function() {
	let i = Math.floor(Math.random() * this.length);
	return this[i];
};

class Markov {
	constructor(n, max) {
		this.n = n;
		this.max = max;
		this.ngrams = {};
		this.beginnings = [];
	}

	feed(text) {
		// length check if too short
		if (text.length < this.n) return false;

		let beginning = text.substring(0, this.n);
		this.beginnings.push(beginning);

		for (var i = 0;i < text.length - this.n; i++) {
			let gram = text.substring(i, i + this.n);
			let next = text.charAt(i + this.n);

			if (!this.ngrams.hasOwnProperty(gram)) this.ngrams[gram] = [];

			this.ngrams[gram].push(next);
		}
	}

	generate() {
		let current = this.beginnings.choice();
		let output = current;

		for (var i = 0;i < this.max; i++) {
			if (this.ngrams.hasOwnProperty(current)) {
				let possible_next = this.ngrams[current];
				let next = possible_next.choice();

				output += next;

				current = output.substring(output.length - this.n, output.length);
			} else {
				break;
			}
		}

		return output;
	}
};

module.exports = Markov;