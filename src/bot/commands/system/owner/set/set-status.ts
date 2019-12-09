import { Command } from 'discord-akairo';
import { Message, PresenceStatusData } from 'discord.js';

export default class SetStatusCommand extends Command {
	public constructor() {
		super('set-status', {
			category: 'Owner',
			description: {
				content: 'Sets the status (DND, Idle, Invisible, Online) for Spectre.',
				usage: '[status]',
				examples: ['dnd', 'invisible', 'invis'],
			},
			clientPermissions: ['SEND_MESSAGES'],
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
		message.util!.reply(`set status to \`${status}\`.`);
	}
}