import SpectreEmbed from '@structures/SpectreEmbed';
import { CATEGORIES } from '@util/constants';
import { Command } from 'discord-akairo';
import { Message } from 'discord.js';
import fetch from 'node-fetch';

export default class BirdCommand extends Command {
	public constructor() {
		super('bird', {
			aliases: ['bird', 'birb'],
			category: CATEGORIES.ANIMAL,
			clientPermissions: ['EMBED_LINKS', 'SEND_MESSAGES'],
			description: {
				content: '🐦 Sends a random bird in the chat.',
				examples: [''],
				usage: '',
			},
			ratelimit: 2,
		});
	}

	public async exec(message: Message) {
		const { link } = await fetch('https://some-random-api.ml/img/birb').then(res => res.json()) as ApiResponse;
		const embed = new SpectreEmbed()
			.setTitle('🐦 Chirp, chirp')
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