import { Command } from 'discord-akairo';
import { Message } from 'discord.js';
import SpectreEmbed from '@structures/SpectreEmbed';
import { stripIndents } from 'common-tags';

export default class PingCommand extends Command {
	public constructor() {
		super('ping', {
			aliases: ['ping', 'pong'],
			category: 'System',
			description: {
				content: 'Check the latency of the bot.',
				examples: [''],
				usage: '',
			},
			clientPermissions: ['EMBED_LINKS', 'SEND_MESSAGES'],
			ratelimit: 2,
		});
	}

	public async exec(message: Message) {
		const msg = await message.util!.send('Pinging...');
		return message.util!.send(new SpectreEmbed()
			.setTitle('🏓 Pong!')
			.setDescription(stripIndents`• Latency: \`${
				((msg.editedTimestamp || msg.createdTimestamp) - (message.editedTimestamp || message.createdTimestamp))}\`ms
				• API Latency: \`${this.client.ws.ping.toFixed(2)}\`ms`));
	}
}