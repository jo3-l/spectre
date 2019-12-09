import { Command } from 'discord-akairo';
import { MessageEmbed, Message, User } from 'discord.js';

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
			clientPermissions: ['EMBED_LINKS'],
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
		message.util!.send(new MessageEmbed()
			.setAuthor(`${user.username}`, avatar)
			.setImage(avatar)
			.setFooter(`Requested by ${message.author.tag}`)
			.setColor(this.client.config.color)
			.setDescription(`[Link](${avatar})`));
	}
}