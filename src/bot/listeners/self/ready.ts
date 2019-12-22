import { Listener } from 'discord-akairo';

export default class extends Listener {
	public constructor() {
		super('ready', {
			emitter: 'client',
			event: 'ready',
			category: 'Self',
		});
	}

	public exec() {
		this.logger.info(`Logged in as ${this.client.user!.tag}.`);
		this.client.activityHandler.start();
		this.logger.info('Started the activityHandler.');
	}
}