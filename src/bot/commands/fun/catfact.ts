import { Command } from 'discord-akairo';
import { Message } from 'discord.js';
import fetch from 'node-fetch';

export default class CatfactCommand extends Command {
	public constructor() {
		super('cat-fact', {
			aliases: ['cat-fact', 'catfacts', 'cf'],
			description: {
				content: 'Sends you a random cat fact.',
				usage: '',
				examples: [''],
			},
			category: 'Fun',
			clientPermissions: ['SEND_MESSAGES'],
		});
	}

	public async exec(message: Message) {
		const { fact } = await fetch('https://catfact.ninja/fact').then(res => res.json()) as IApiResponse;
		return message.util!.send(`🐱: ${fact}`);
	}
}

interface IApiResponse {
	fact: string;
}