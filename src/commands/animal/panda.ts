import { Command } from 'discord-akairo';
import fetch from 'node-fetch';
import { Message } from 'discord.js';
import SpectreEmbed from '../../structures/SpectreEmbed';

export default class PandaCommand extends Command {
	public constructor() {
		super('panda', {
			aliases: ['panda'],
			description: {
				content: '🐼 Sends a random panda in the chat.',
				usage: '',
				examples: [''],
			},
			category: 'Animals',
			clientPermissions: ['EMBED_LINKS', 'SEND_MESSAGES'],
			ratelimit: 2,
		});
	}

	public async exec(message: Message) {
		const { link } = await fetch('https://some-random-api.ml/img/panda').then(res => res.json()) as ApiResponse;
		const embed = new SpectreEmbed()
			.setTitle('🐼 Panda')
			.setImage(link)
			.setURL(link)
			.setFooter('Powered by some-random-api.ml')
			.setTimestamp();
		return message.util!.send(embed);
	}
}

interface ApiResponse {
	link: string;
}