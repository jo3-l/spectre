import { Command } from 'discord-akairo';
import { scrapeSubreddit } from '@util/redditUtil';
import { Message } from 'discord.js';
import { CATEGORIES } from '@util/constants';

export default class ShowerThoughtsCommand extends Command {
	public constructor() {
		super('shower-thoughts', {
			aliases: ['shower-thoughts', 'shower-thought'],
			category: CATEGORIES.REDDIT,
			clientPermissions: ['SEND_MESSAGES'],
			description: {
				content: 'Things to think about in the shower.',
				usage: '',
				examples: [''],
			},
		});
	}

	public async exec(message: Message) {
		const data = await scrapeSubreddit({ subreddit: 'showerthoughts' });
		if (data === 'NO_ITEMS_FOUND') {
			return message.util!.send(
				'Sorry, we couldn\'t find any showerthoughts to show you. Try again later.',
			);
		}
		return message.util!.send(data.title);
	}
}