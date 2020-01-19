import { CATEGORIES } from '@util/constants';
import cheerio from 'cheerio';
import { Command } from 'discord-akairo';
import { Message } from 'discord.js';
import fetch from 'node-fetch';

export default class TopicCommand extends Command {
	public constructor() {
		super('topic', {
			aliases: ['topic'],
			category: CATEGORIES.FUN,
			clientPermissions: ['SEND_MESSAGES'],
			description: {
				content: 'Random topic / conversation starter.',
				examples: [''],
				usage: '',
			},
		});
	}

	public async exec(message: Message) {
		const raw = await fetch('https://www.conversationstarters.com/generator.php').then(res => res.text());
		const $ = cheerio.load(raw);
		return message.util!.send($('#random').text());
	}
}