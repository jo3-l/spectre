import { Command } from 'discord-akairo';
import { Message } from 'discord.js';

export default class SetPlayingCommand extends Command {
	public constructor() {
		super('set-playing', {
			category: 'Owner',
			args: [{ id: 'status', match: 'content' }],
		});
	}

	public exec(message: Message, { status }: { status?: string }) {
		if (!status) {
			this.client.activityHandler.start();
			return message.util!.send(`${this.client.emojis.success} Set status to default.`);
		}
		this.client.activityHandler.set(status);
		message.util!.send(`${this.client.emojis.success} Set status to \`${status}\`.`);
	}
}