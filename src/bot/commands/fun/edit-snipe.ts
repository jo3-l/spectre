import { Command } from 'discord-akairo';
import { MessageEmbed, Message } from 'discord.js';

export default class EditSnipeCommand extends Command {
	public constructor() {
		super('edit-snipe', {
			aliases: ['edit-snipe'],
			category: 'Fun',
			clientPermissions: ['EMBED_LINKS', 'SEND_MESSAGES'],
			description: {
				content: 'Finds the last edited message (if any) from this channel and resends it.',
				usage: '',
				examples: [''],
			},
			channel: 'guild',
		});
	}


	public exec(message: Message) {
		if (!message.channel.editSnipe) return message.util!.send('There\'s no snipes avaliable for this channel.');
		const { author, content, timestamp } = message.channel.editSnipe;
		const embed = new MessageEmbed()
			.setAuthor(author.tag, author.displayAvatarURL())
			.setTimestamp(timestamp)
			.setFooter(`Edit sniped by ${message.author.username}`)
			.setColor('RANDOM');
		if (content) embed.setDescription(content.length > 1024 ? `${content.slice(0, 1021)}...` : content);
		return message.util!.send(embed);
	}
}