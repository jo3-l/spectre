import { Command } from 'discord-akairo';
import fetch from 'node-fetch';
import { Message } from 'discord.js';
import SpectreEmbed from '@structures/SpectreEmbed';
import { CATEGORIES } from '@util/constants';

export default class RedPandaCommand extends Command {
	public constructor() {
		super('redpanda', {
			aliases: ['red-panda'],
			description: {
				content: '🐼 Sends a random red panda in the chat.',
				usage: '',
				examples: [''],
			},
			category: CATEGORIES.ANIMAL,
			clientPermissions: ['EMBED_LINKS', 'SEND_MESSAGES'],
			ratelimit: 2,
		});
	}

	public async exec(message: Message) {
		const { link } = await fetch('https://some-random-api.ml/img/redpanda').then(res => res.json()) as ApiResponse;
		const embed = new SpectreEmbed()
			.setTitle('🐼 Red Panda')
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