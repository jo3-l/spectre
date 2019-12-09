import { Command } from 'discord-akairo';
import { MessageEmbed, Message } from 'discord.js';

export default class SnipeCommand extends Command {
	public constructor() {
		super('snipe', {
			aliases: ['snipe'],
			category: 'Fun',
			clientPermissions: ['EMBED_LINKS', 'SEND_MESSAGES'],
			description: {
				content: 'Finds the last message (if any) from this channel and resends it.',
				usage: '',
				examples: [''],
			},
			channel: 'guild',
		});
	}


	public exec(message: Message) {
		if (!message.channel.snipe) return message.util!.send('There\'s no snipes avaliable for this channel.');
		const { author, content, timestamp, attachment } = message.channel.snipe;
		const embed = new MessageEmbed()
			.setAuthor(author.tag, author.displayAvatarURL())
			.setTimestamp(timestamp)
			.setFooter(`Sniped by ${message.author.username}`)
			.setColor('RANDOM')
			.setImage(attachment);
		if (content) embed.setDescription(content.length > 1024 ? `${content.slice(0, 1021)}...` : content);
		return message.util!.send(embed);
	}
}