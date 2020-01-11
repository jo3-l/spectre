import { Command } from 'discord-akairo';
import { Message, User } from 'discord.js';
import SpectreEmbed from '@structures/SpectreEmbed';

export default class AvatarCommand extends Command {
	public constructor() {
		super('avatar', {
			aliases: ['avatar', 'av', 'pfp'],
			category: 'Info',
			description: {
				content: 'Displays the avatar of a given user.',
				usage: '[user]',
				examples: ['', '@Joe'],
			},
			clientPermissions: ['EMBED_LINKS', 'SEND_MESSAGES'],
			args: [
				{
					'id': 'user',
					'type': 'user',
					'default': (msg: Message) => msg.author,
				},
			],
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