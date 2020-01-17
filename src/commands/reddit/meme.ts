import { Command } from 'discord-akairo';
import { Message } from 'discord.js';
import { scrapeSubreddit } from '@util/redditUtil';
import { CATEGORIES } from '@util/constants';

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
		const meme = await scrapeSubreddit({ subreddit: 'dankmemes' })
			.catch(() => null);
		if (!meme) {
			return message.util!.send(`${this.client.emojis.error} I was unable to find any memes to show you. Try again later?`);
		}
		return message.util!.send(meme.embed());
	}
}