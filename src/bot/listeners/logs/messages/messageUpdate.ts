import Log, { emojis } from '../../../structures/Log';
import { escapedCodeblock } from '../../../../util/Util';
import { Listener } from 'discord-akairo';
import { Message, MessageEmbed } from 'discord.js';

export default class MessageUpdateListener extends Listener {
	public constructor() {
		super('messageUpdate', {
			emitter: 'client',
			event: 'messageUpdate',
			category: 'Logs',
		});
	}

	public async exec(oldMessage: Message, newMessage: Message) {
		if (!newMessage.guild) return;
		const channel = Log.fetchChannel(newMessage.guild, 'messages');
		if (!channel) return;
		if (oldMessage.content === newMessage.content) return;
		const oldContentDisplay = escapedCodeblock(oldMessage.content);
		const newContentDisplay = escapedCodeblock(newMessage.content);
		const embed = new MessageEmbed()
			.setColor('ORANGE')
			.setAuthor(`${newMessage.author.tag}'s message was edited`, emojis.updateMessage)
			.setFooter(`Message ID: ${newMessage.id}`)
			.setTimestamp()
			.setDescription(`
				▫️ **Message initially sent at:** ${Log.formatTime(oldMessage.createdAt)}
				▫️ **Message edited at:** ${Log.formatTime(newMessage.editedAt!)}
				▫️ **Message author:** ${Log.formatUser(newMessage.author)}
				${oldContentDisplay.length < 900 ? `▫️ **Before:** ${oldContentDisplay}` : ''}
				${newContentDisplay.length < 900 ? `▫️ **After:** ${newContentDisplay}` : ''}
			`);
		let txt = '';
		if (oldContentDisplay.length >= 900) txt += `BEFORE:\r\n${oldMessage.content}`;
		if (newContentDisplay.length >= 900) txt += `\nAFTER:\r\n${newMessage.content}`;
		if (txt.length) embed.attachFiles([{ attachment: Buffer.from(txt, 'utf8'), name: 'edited_content.txt' }]);
		Log.send(channel, embed);
	}
}