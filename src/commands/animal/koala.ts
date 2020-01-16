import { Command } from 'discord-akairo';
import fetch from 'node-fetch';
import { Message } from 'discord.js';
import SpectreEmbed from '@structures/SpectreEmbed';
import { CATEGORIES } from '@util/Constants';

export default class KoalaCommand extends Command {
	public constructor() {
		super('koala', {
			aliases: ['koala'],
			description: {
				content: '🐨 Sends a random koala in the chat.',
				usage: '',
				examples: [''],
			},
			category: CATEGORIES.ANIMAL,
			clientPermissions: ['EMBED_LINKS', 'SEND_MESSAGES'],
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