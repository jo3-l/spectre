import { CATEGORIES } from '@util/constants';
import { Command } from 'discord-akairo';
import { Message } from 'discord.js';
import fetch from 'node-fetch';

export default class CatfactCommand extends Command {
	public constructor() {
		super('cat-fact', {
			aliases: ['cat-fact', 'catfacts', 'cf'],
			category: CATEGORIES.FUN,
			clientPermissions: ['SEND_MESSAGES'],
			description: {
				content: 'Sends you a random cat fact.',
				examples: [''],
				usage: '',
			},
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