import { Command } from 'discord-akairo';
import { Message } from 'discord.js';
import fetch from 'node-fetch';
import * as cheerio from 'cheerio';

export default class TopicCommand extends Command {
	public constructor() {
		super('topic', {
			aliases: ['topic'],
			description: {
				content: 'Random topic / conversation starter.',
				usage: '',
				examples: [''],
			},
			category: 'Fun',
			clientPermissions: ['SEND_MESSAGES'],
		});
	}

	public async exec(message: Message) {
		const raw = await fetch('https://www.conversationstarters.com/generator.php').then(res => res.text());
		const $ = cheerio.load(raw);
		return message.util!.send($('#random').text());
	}
}