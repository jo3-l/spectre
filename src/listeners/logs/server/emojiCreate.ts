import SpectreEmbed from '@structures/SpectreEmbed';
import Log, { emojis } from '@util/logUtil';
import { formatTime, formatUser } from '@util/util';
import { Listener } from 'discord-akairo';
import { GuildEmoji } from 'discord.js';

export default class EmojiCreateListener extends Listener {
	public constructor() {
		super('emojiCreate', {
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
		const embed = new SpectreEmbed()
			.setAuthor('A new emoji was created', emojis.createEmoji)
			.setTimestamp()
			.setFooter(`Emoji ID: ${emoji.id}`)
			.setColor('GREEN')
			.setDescription(`
				▫️ **Emoji:** ${emoji}
				▫️ **Emoji name:** \`${emoji.name}\`
				▫️ **Animated:** ${emoji.animated ? 'yes' : 'no'}
				▫️ **URL:** [View here](${emoji.url})
				▫️ **Timestamp of creation:** ${formatTime(emoji.createdAt!)}
				${executor ? `▫️ **Created by:** ${formatUser(executor)}` : ''}
				${entry?.reason ? `▫️ **Reason:** ${entry.reason}` : ''}
			`)
			.setThumbnail(emoji.url);
		channel.send(embed);
	}
}