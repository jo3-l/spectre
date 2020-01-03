import Log from '../../../structures/Log';
import { Listener } from 'discord-akairo';
import { GuildEmoji, MessageEmbed } from 'discord.js';

export default class EmojiCreateListener extends Listener {
	public constructor() {
		super('emojiCreate', {
			category: 'Logs',
			emitter: 'client',
			event: 'emojiCreate',
		});
	}

	public async exec(emoji: GuildEmoji) {
		const { guild } = emoji;
		const channel = await Log.fetchChannel(guild, 'server');
		if (!channel) return;
		const entry = await Log.getEntry(guild, 'EMOJI_CREATE');
		const executor = await Log.getExecutor({ guild, id: emoji.id }, 'EMOJI_CREATE', entry);
		const embed = new MessageEmbed()
			.setAuthor(`A new emoji was created`, guild.iconURL() || '')
			.setTimestamp()
			.setFooter(`Emoji ID: ${emoji.id}`)
			.setColor('GREEN')
			.setDescription(`
				▫️ **Emoji:** ${emoji}
				▫️ **Emoji name:** \`${emoji.name}\`
				▫️ **Animated:** ${emoji.animated ? 'yes' : 'no'}
				▫️ **URL:** [Emoji URL](${emoji.url!})
				▫️ **Timestamp of creation:** ${Log.formatTime(emoji.createdAt!)}
				${executor ? `▫️ **Created by:** ${Log.formatUser(executor)}` : ''}
				${entry?.reason ? `▫️ **Reason:** ${entry.reason}` : ''}
			`)
			.setThumbnail(emoji.url!);
		Log.send(channel, embed);
	}
}