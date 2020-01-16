import { Command } from 'discord-akairo';
import { Message } from 'discord.js';
import { scrapeSubreddit } from '@util/Reddit';
import { CATEGORIES } from '@util/Constants';

export default class MemeCommand extends Command {
	public constructor() {
		super('meme', {
			aliases: ['meme', 'random-meme', 'dankmeme'],
			category: CATEGORIES.REDDIT,
			clientPermissions: ['SEND_MESSAGES', 'EMBED_LINKS'],
			description: {
				content: 'Fresh dank memes!',
				usage: '',
				examples: [''],
			},
		});
	}

	public async exec(message: Message) {
		const meme = await scrapeSubreddit({ subreddit: 'dankmemes' });
		if (meme === 'NO_ITEMS_FOUND') {
			return message.util!.send(
				'Sorry, we could\'t find any dank memes to show you. Try again later.',
			);
		}
		return message.util!.send(meme.embed());
	}
}