import { AkairoClient } from 'discord-akairo';
import { ActivityOptions } from 'discord.js';

interface StaticActivity {
	activity: string;
	options?: ActivityOptions;
}
type ActivityCastor = (client: AkairoClient) => StaticActivity;
export type Activity = StaticActivity | ActivityCastor;

export default class ActivityHandler {
	private current = 0;
	private _interval: NodeJS.Timeout | null = null;
	public readonly activities: StaticActivity[];
	public constructor(
		private readonly client: AkairoClient, activities: Activity[], private readonly interval: number = 5 * 60000,
	) {
		this.activities = activities.map((activity: Activity) => Object.assign({ type: 'PLAYING' }, typeof activity === 'function'
			? activity(this.client)
			: activity));
	}

	private get next(): StaticActivity {
		return this.activities[++this.current % this.activities.length];
	}

	public start() {
		if (this._interval !== null) return;
		const setActivity = () => {
			const { activity, ...options } = this.next;
			this.client.user!.setActivity(activity, options as ActivityOptions);
		};
		this._interval = setInterval(setActivity, this.interval);
		setActivity();
	}

	public stop() {
		if (!this._interval) return;
		clearTimeout(this._interval);
		this._interval = null;
	}

	public set(activity: string, options?: ActivityOptions) {
		this.client.user!.setActivity(activity, options);
		this.stop();
	}
}