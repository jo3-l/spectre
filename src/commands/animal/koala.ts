import { CATEGORIES } from '@util/constants';
import SpectreEmbed from '@util/SpectreEmbed';
import { Command } from 'discord-akairo';
import { Message } from 'discord.js';
import fetch from 'node-fetch';

export default class KoalaCommand extends Command {
	public constructor() {
		super('koala', {
			aliases: ['koala'],
			category: CATEGORIES.ANIMAL,
			clientPermissions: ['EMBED_LINKS', 'SEND_MESSAGES'],
			description: {
				content: '🐨 Sends a random koala in the chat.',
				examples: [''],
				usage: '',
			},
			ratelimit: 2,
		});
	}

	public async exec(message: Message) {
		const { link } = await fetch('https://some-random-api.ml/img/koala').then(res => res.json()) as ApiResponse;
		const embed = new SpectreEmbed()
			.setTitle('🐨 Koala')
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