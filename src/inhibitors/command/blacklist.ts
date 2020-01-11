import { Inhibitor } from 'discord-akairo';
import { Message } from 'discord.js';

export default class BlacklistInhibitor extends Inhibitor {
	public constructor() {
		super('blacklist', {
			reason: 'blacklist',
			category: 'Command',
		});
	}

	public exec(message: Message) {
		const blacklist = this.client.settings.get('global', 'blacklist', [] as string[]);
		return blacklist.includes(message.author.id);
	}
}