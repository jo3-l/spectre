import { Command } from 'discord-akairo';
import fetch from 'node-fetch';
import { Message } from 'discord.js';
import SpectreEmbed from '@structures/SpectreEmbed';
import { CATEGORIES } from '@util/constants';

export default class FoxCommand extends Command {
	public constructor() {
		super('fox', {
			aliases: ['fox'],
			description: {
				content: '🦊 Sends a random fox in the chat.',
				usage: '',
				examples: [''],
			},
			category: CATEGORIES.ANIMAL,
			clientPermissions: ['EMBED_LINKS', 'SEND_MESSAGES'],
			ratelimit: 2,
		});
	}

	public async exec(message: Message) {
		const { link } = await fetch('https://some-random-api.ml/img/fox').then(res => res.json()) as ApiResponse;
		const embed = new SpectreEmbed()
			.setTitle('🦊 Fox')
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