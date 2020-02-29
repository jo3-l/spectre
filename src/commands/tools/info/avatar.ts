import { CATEGORIES } from '@util/constants';
import SpectreEmbed from '@util/SpectreEmbed';
import { Command } from 'discord-akairo';
import { Message, User } from 'discord.js';

export default class AvatarCommand extends Command {
	public constructor() {
		super('avatar', {
			aliases: ['avatar', 'av', 'pfp'],
			args: [
				{
					'default': (msg: Message) => msg.author,
					'id': 'user',
					'type': 'user',
				},
			],
			category: CATEGORIES.INFO,
			clientPermissions: ['EMBED_LINKS', 'SEND_MESSAGES'],
			description: {
				content: 'Displays the avatar of a given user.',
				examples: ['', '@Joe'],
				usage: '[user]',
			},
		});
	}

	public exec(message: Message, { user }: { user: User }) {
		const avatar = user.displayAvatarURL({ size: 1024 });
		message.util!.send(new SpectreEmbed()
			.setAuthor(user.tag, avatar)
			.setImage(avatar)
			.setFooter(`Requested by ${message.author.tag}`));
	}
}