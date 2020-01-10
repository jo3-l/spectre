import { Command } from 'discord-akairo';
import { Message, PresenceStatusData } from 'discord.js';

export default class SetStatusCommand extends Command {
	public constructor() {
		super('set-status', {
			category: 'Owner',
			args: [
				{
					'id': 'status',
					'type': [
						['offline', 'invisible', 'invis'],
						['dnd', 'do not disturb'],
						'online',
						'idle',
					],
					'default': 'online',
				},
			],
		});
	}

	public exec(message: Message, { status }: { status: PresenceStatusData }) {
		this.client.user!.setStatus(status);
		message.util!.send(`${this.client.emojis.success} Set status to \`${status}\`.`);
	}
}