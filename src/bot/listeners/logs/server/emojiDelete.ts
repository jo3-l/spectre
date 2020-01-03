import Log from '../../../structures/Log';
import { Listener } from 'discord-akairo';
import { GuildEmoji, MessageEmbed } from 'discord.js';

export default class EmojiDeleteListener extends Listener {
	public constructor() {
		super('emojiDelete', {
			category: 'Logs',
			emitter: 'client',
			event: 'emojiDelete',
		});
	}

	public async exec(emoji: GuildEmoji) {
		const { guild } = emoji;
		const channel = await Log.fetchChannel(guild, 'server');
		if (!channel) return;
		const entry = await Log.getEntry(guild, 'EMOJI_DELETE');
		const executor = await Log.getExecutor({ guild, id: emoji.id }, 'EMOJI_DELETE', entry);
		const embed = new MessageEmbed()
			.setAuthor(`An emoji was deleted`, guild.iconURL() || '')
			.setTimestamp()
			.setFooter(`Emoji ID: ${emoji.id}`)
			.setColor('RED')
			.setDescription(`
				▫️ **Emoji:** ${emoji}
				▫️ **Emoji name:** \`${emoji.name}\`
				▫️ **Animated:** ${emoji.animated ? 'yes' : 'no'}
				▫️ **URL:** [Emoji URL](${emoji.url!})
				▫️ **Timestamp of creation:** ${Log.formatTime(emoji.createdAt!)}
				${executor ? `▫️ **Deleted by:** ${Log.formatUser(executor)}` : ''}
				${entry?.reason ? `▫️ **Reason:** ${entry.reason}` : ''}
			`)
			.setThumbnail(emoji.url!);
		Log.send(channel, embed);
	}
}