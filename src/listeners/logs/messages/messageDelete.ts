import Log, { emojis } from '@structures/Log';
import { escapedCodeblock, formatUser, formatTime } from '@util/Util';
import { Listener } from 'discord-akairo';
import { Message, User } from 'discord.js';
import SpectreEmbed from '@structures/SpectreEmbed';

export default class MessageDeleteListener extends Listener {
	public constructor() {
		super('messageDelete', {
			emitter: 'client',
			event: 'messageDelete',
		});
	}

	public async exec(message: Message) {
		if (!message.guild) return;
		const channel = Log.fetchChannel(message.guild, 'messages');
		if (!channel) return;
		let executor: User;
		const entry = await Log.getEntry(message.guild, 'MESSAGE_DELETE');
		// @ts-ignore
		// eslint-disable-next-line max-len
		if (entry && entry.extra.channel.id === message.channel.id && (entry.target.id === message.author.id) && (entry.createdTimestamp > (Date.now() - 5000)) && (entry.extra.count >= 1)) {
			executor = entry.executor;
		} else {
			executor = message.author;
		}
		const content = this._displayContent(message);
		const embed = new SpectreEmbed()
			.setAuthor(`${message.author.tag}'s message was deleted`, emojis.deleteMessage)
			.setColor('RED')
			.setTimestamp()
			.setFooter(`Message ID: ${message.id}`)
			.setDescription(`
				▫️ **Deleted by:** ${formatUser(executor)}
				▫️ **Timestamp of message:** ${formatTime(message.createdAt)}
				▫️ **Channel:** ${message.channel} (${message.channel.id})
				▫️ **Message author:** ${formatUser(message.author)}
				▫️ **Message content:** ${content.length < 1800 ? content : ''}
			`);
		if (message.attachments.size) {
			embed.attachFiles([{
				attachment: message.attachments.first()!.proxyURL,
				name: 'deleted.png',
			}]);
			embed.description += `\n▫️ **Deleted image:**`;
			embed.setImage('attachment://deleted.png');
		}
		if (!content && message.content) {
			embed.attachFiles([{
				attachment: Buffer.from(message.content, 'utf8'),
				name: 'deleted_content.txt',
			}]);
		}
		channel.send(embed);
	}

	private _displayContent(message: Message) {
		if (message.embeds.length && !message.content) return `*${message.embeds.length} embeds not shown.*`;
		return escapedCodeblock(message.content);
	}
}