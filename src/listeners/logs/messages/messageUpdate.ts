import Log, { emojis } from '@structures/Log';
import { escapedCodeblock, formatTime, formatUser } from '@util/Util';
import { Listener } from 'discord-akairo';
import { Message } from 'discord.js';
import SpectreEmbed from '@structures/SpectreEmbed';

export default class MessageUpdateListener extends Listener {
	public constructor() {
		super('messageUpdate', {
			emitter: 'client',
			event: 'messageUpdate',
		});
	}

	public async exec(oldMessage: Message, newMessage: Message) {
		if (!newMessage.guild) return;
		const channel = Log.fetchChannel(newMessage.guild, 'messages');
		if (!channel) return;
		if (oldMessage.content === newMessage.content) return;
		const oldContentDisplay = this._getContent(oldMessage);
		const newContentDisplay = this._getContent(newMessage);
		const embed = new SpectreEmbed()
			.setColor('ORANGE')
			.setAuthor(`${newMessage.author.tag}'s message was edited`, emojis.updateMessage)
			.setFooter(`Message ID: ${newMessage.id}`)
			.setTimestamp()
			.setDescription(`
				▫️ **Message initially sent at:** ${formatTime(oldMessage.createdAt)}
				▫️ **Message edited at:** ${formatTime(newMessage.editedAt!)}
				▫️ **Message author:** ${formatUser(newMessage.author)}
				▫️ **Message link:** [Click here](${newMessage.url})
				${oldContentDisplay.length < 900 ? `▫️ **Before:** ${oldContentDisplay}` : ''}
				${newContentDisplay.length < 900 ? `▫️ **After:** ${newContentDisplay}` : ''}
			`);
		let txt = '';
		if (oldContentDisplay.length >= 900) txt += `BEFORE:\r\n${oldMessage.content}`;
		if (newContentDisplay.length >= 900) txt += `\nAFTER:\r\n${newMessage.content}`;
		if (txt.length) embed.attachFiles([{ attachment: Buffer.from(txt, 'utf8'), name: 'edited_content.txt' }]);
		channel.send(embed);
	}

	private _getContent(message: Message) {
		if (message.embeds.length && !message.content) return `*${message.embeds.length} embeds not shown.*`;
		return escapedCodeblock(message.content);
	}
}