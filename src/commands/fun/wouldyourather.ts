import { CATEGORIES } from '@util/constants';
import SpectreEmbed from '@util/SpectreEmbed';
import cheerio from 'cheerio';
import { stripIndents } from 'common-tags';
import { Command } from 'discord-akairo';
import { Message } from 'discord.js';
import fetch from 'node-fetch';

const EMOJIS = { ONE: '1⃣', TWO: '2⃣' };

export default class WouldYouRatherCommand extends Command {
	public constructor() {
		super('wouldyourather', {
			aliases: ['wouldyourather', 'wyr'],
			category: CATEGORIES.FUN,
			clientPermissions: ['SEND_MESSAGES', 'EMBED_LINKS', 'ADD_REACTIONS'],
			description: {
				content: 'Would you rather question, pulled from either.io.',
				examples: [''],
				usage: '',
			},
		});
	}

	public async exec(message: Message) {
		const raw = await fetch('http://either.io/').then(res => res.text());
		const $ = cheerio.load(raw);
		const first = $('.option-text').eq(0).text();
		const second = $('.option-text').eq(1).text();
		const msg = await message.util!.send(
			new SpectreEmbed()
				.setColor('RANDOM')
				.setTitle('Would You Rather')
				.setURL('https://either.io')
				.setDescription(stripIndents`${EMOJIS.ONE} ${first}
					${EMOJIS.TWO} ${second}`)
				.setFooter('Powered by either.io'),
		);
		await msg.react(EMOJIS.ONE);
		await msg.react(EMOJIS.TWO);
	}
}