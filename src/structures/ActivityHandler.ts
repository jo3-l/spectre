import { AkairoClient } from 'discord-akairo';
import { ActivityOptions } from 'discord.js';

type StaticActivity = {
	activity: string;
} & ActivityOptions;

export type Activity = StaticActivity | ((client: AkairoClient) => StaticActivity);

export default class ActivityHandler {
	private _current = 0;
	private _interval: NodeJS.Timeout | null = null;
	public constructor(
		private readonly client: AkairoClient,
		public readonly activities: Activity[],
		private readonly interval: number = 5 * 60000,
	) { }

	private get _next() {
		const applyDefaults = (activity: StaticActivity) => Object.assign({ type: 'PLAYING' }, activity);
		const next = this.activities[++this._current % this.activities.length];
		if (typeof next === 'function') return applyDefaults(next(this.client));
		return applyDefaults(next);
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