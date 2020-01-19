import { CATEGORIES } from '@util/constants';
import { Command } from 'discord-akairo';
import { Message, PresenceStatusData } from 'discord.js';

export default class SetStatusCommand extends Command {
	public constructor() {
		super('set-status', {
			args: [
				{
					'default': 'online',
					'id': 'status',
					'type': [
						['invisible', 'invis', 'offline'],
						['dnd', 'do not disturb'],
						'online',
						'idle',
					],
				},
			],
			category: CATEGORIES.OWNER,
		});
	}

	public exec(message: Message, { status }: { status: PresenceStatusData }) {
		this.client.user!.setStatus(status);
		message.util!.send(`${this.client.emojis.success} Set status to \`${status}\`.`);
	}
}