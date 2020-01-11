interface Array<T> {
	random(): T;
	last(): T;
}

Object.defineProperties(
	Array.prototype,
	{
		random: {
			value: function(this: Array<any>) {
				return this[Math.floor(Math.random() * this.length)];
			},
		},
		last: {
			get: function(this: Array<any>) {
				return this[this.length - 1];
			},
		},
	},
);