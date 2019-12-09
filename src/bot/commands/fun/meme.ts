import { Command } from 'discord-akairo';
import { Message } from 'discord.js';
import { constructEmbed, scrape } from '../../../util/Reddit';

export default class MemeCommand extends Command {
	public constructor() {
		super('meme', {
			aliases: ['meme', 'random-meme', 'dankmeme'],
			category: 'Fun',
			clientPermissions: ['SEND_MESSAGES', 'EMBED_LINKS'],
			description: {
				content: 'Fresh dank memes!',
				usage: '',
				examples: [''],
			},
		});
	}

	public async exec(message: Message) {
		const meme = await scrape({ subreddit: 'dankmemes' })
			.catch(() => {
				message.util!.reply('sorry, there were no fresh memes. Please try again later.');
			});
		if (!meme) return;
		return message.util!.send(await constructEmbed(meme));
	}
}