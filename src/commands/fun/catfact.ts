import { Command } from 'discord-akairo';
import { Message } from 'discord.js';
import fetch from 'node-fetch';
import { CATEGORIES } from '@util/constants';

export default class CatfactCommand extends Command {
	public constructor() {
		super('cat-fact', {
			aliases: ['cat-fact', 'catfacts', 'cf'],
			description: {
				content: 'Sends you a random cat fact.',
				usage: '',
				examples: [''],
			},
			category: CATEGORIES.FUN,
			clientPermissions: ['SEND_MESSAGES'],
		});
	}

	public async exec(message: Message) {
		const { fact } = await fetch('https://catfact.ninja/fact').then(res => res.json()) as ApiResponse;
		return message.util!.send(`🐱: ${fact}`);
	}
}

interface ApiResponse {
	fact: string;
}