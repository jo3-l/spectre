export default class Timer {
	private readonly _createdAt = process.hrtime.bigint();
	private _finished = false;
	public constructor(private readonly precision = 2) { }

	public stop() {
		if (this._finished) throw new Error('Timer has already ended.');
		this._finished = true;
		const end = process.hrtime.bigint();
		return (Number(end - this._createdAt) / 1e6).toFixed(this.precision);
	}
}