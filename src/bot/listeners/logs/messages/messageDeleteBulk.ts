import Log, { emojis } from '../../../structures/Log';
import { Listener } from 'discord-akairo';
import { Message, MessageEmbed, Collection, Snowflake, TextChannel } from 'discord.js';
import { stripIndents } from 'common-tags';

export default class MessageDeleteBulkListener extends Listener {
	public constructor() {
		super('messageDeleteBulk', {
			emitter: 'client',
			event: 'messageDeleteBulk',
			category: 'Logs',
		});
	}

	public async exec(messages: Collection<Snowflake, Message>) {
		const guild = messages.first()!.guild;
		if (!guild) return;
		const channel = Log.fetchChannel(guild, 'messages');
		if (!channel) return;
		const embed = new MessageEmbed()
			.setAuthor(`Messages were bulk deleted in #${(messages.first()!.channel as TextChannel).name}`,
				emojis.deleteMessage)
			.setColor('RED')
			.setTimestamp()
			.setFooter(`Channel ID: ${messages.first()!.channel.id}`)
			.setDescription(`
				▫️ **Amounted deleted:** ${messages.size}
				▫️ **Channel:** ${messages.first()!.channel} (ID ${messages.first()!.channel.id})
			`)
			.attachFiles([{
				attachment: Buffer.from(
					messages
						.map(msg =>
							stripIndents`[${Log.formatTime(msg.createdAt)}] ${Log.formatUser(msg.author)}: ${msg.content}
							${msg.attachments.first()?.proxyURL ?? ''}`)
						.reverse()
						.join('\r\n'), 'utf8',
				),
				name: 'deleted_messages.txt',
			}]);
		Log.send(channel, embed);
	}
}