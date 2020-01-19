interface Array<T> {
	random(): T;
	last(): T;
}

Object.defineProperties(
	Array.prototype,
	{
		last: {
			get(this: Array<any>) {
				return this[this.length - 1];
			},
		},
		random: {
			value(this: Array<any>) {
				return this[Math.floor(Math.random() * this.length)];
			},
		},
	},
);