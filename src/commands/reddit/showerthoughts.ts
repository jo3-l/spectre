import { CATEGORIES } from '@util/constants';
import { scrapeSubreddit } from '@util/redditUtil';
import { Command } from 'discord-akairo';
import { Message } from 'discord.js';

export default class ShowerThoughtsCommand extends Command {
	public constructor() {
		super('shower-thoughts', {
			aliases: ['shower-thoughts', 'shower-thought'],
			category: CATEGORIES.REDDIT,
			clientPermissions: ['SEND_MESSAGES'],
			description: {
				content: 'Things to think about in the shower.',
				examples: [''],
				usage: '',
			},
		});
	}

	public async exec(message: Message) {
		const showerthought = await scrapeSubreddit({ subreddit: 'showerthoughts' })
			.catch(() => undefined);
		if (!showerthought) {
			return message.util!.send(`${this.client.emojis.error} There were no showerthoughts to show you. Try again later?`);
		}
		return message.util!.send(showerthought.title);
	}
}