export default class Timer {
	private readonly start = process.hrtime.bigint();
	private stopped = false;
	public constructor(private readonly precision: number = 2) { }

	public stop() {
		if (this.stopped) throw new Error('Timer has already ended.');
		this.stopped = true;
		const end = process.hrtime.bigint();
		return (Number(end - this.start) / 1e6).toFixed(this.precision);
	}
}