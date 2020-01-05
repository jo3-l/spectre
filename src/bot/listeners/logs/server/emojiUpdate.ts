import Log, { emojis } from '../../../structures/Log';
import { Listener } from 'discord-akairo';
import { GuildEmoji, MessageEmbed } from 'discord.js';

export default class EmojiUpdateListener extends Listener {
	public constructor() {
		super('emojiUpdate', {
			category: 'Logs',
			emitter: 'client',
			event: 'emojiUpdate',
		});
	}

	public async exec(oldEmoji: GuildEmoji, newEmoji: GuildEmoji) {
		// We don't want to log anything other than emoji renames (for now)
		if (oldEmoji.name === newEmoji.name) return;
		const { guild } = newEmoji;
		const channel = await Log.fetchChannel(guild, 'server');
		if (!channel) return;
		const entry = await Log.getEntry(guild, 'EMOJI_UPDATE');
		const executor = await Log.getExecutor({ guild, id: newEmoji.id }, 'EMOJI_UPDATE', entry);
		const embed = new MessageEmbed()
			.setAuthor(`An emoji was renamed`, emojis.updateEmoji)
			.setTimestamp()
			.setFooter(`Emoji ID: ${newEmoji.id}`)
			.setColor('ORANGE')
			.setDescription(`
				▫️ **Emoji:** ${newEmoji}
				▫️ **Updated emoji name:** \`${newEmoji.name}\`
				▫️ **Old emoji name:** \`${oldEmoji.name}\`
				▫️ **Animated:** ${newEmoji.animated ? 'yes' : 'no'}
				▫️ **URL:** [Emoji URL](${newEmoji.url!})
				${executor ? `▫️ **Updated by:** ${Log.formatUser(executor)}` : ''}
				${entry?.reason ? `▫️ **Reason:** ${entry.reason}` : ''}
			`)
			.setThumbnail(newEmoji.url!);
		channel.send(embed);
	}
}