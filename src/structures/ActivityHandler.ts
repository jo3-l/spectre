import { AkairoClient } from 'discord-akairo';
import { ActivityOptions } from 'discord.js';

interface StaticActivity {
	activity: string;
	options?: ActivityOptions;
}

export type Activity = StaticActivity | ((client: AkairoClient) => StaticActivity);

export default class ActivityHandler {
	private _current = 0;
	private _interval: NodeJS.Timeout | null = null;
	public readonly activities: StaticActivity[];
	public constructor(
		private readonly client: AkairoClient,
		activities: Activity[],
		private readonly interval: number = 5 * 60000,
	) {
		this.activities = activities.map(activity => (
			Object.assign(
				{ type: 'PLAYING' },
				typeof activity === 'function' ? activity(this.client) : activity,
			)
		));
	}

	private get _next() {
		return this.activities[++this._current % this.activities.length];
	}

	public start() {
		if (this._interval) return;
		const setActivity = () => {
			const { activity, ...options } = this._next;
			this.client.user!.setActivity(activity, options as ActivityOptions);
		};
		this._interval = setInterval(setActivity, this.interval);
		setActivity();
	}

	public set(activity: string, options?: ActivityOptions) {
		this.client.user!.setActivity(activity, options);
		if (!this._interval) return;
		clearTimeout(this._interval);
		this._interval = null;
	}
}