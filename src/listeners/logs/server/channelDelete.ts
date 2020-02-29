import Log, { emojis } from '@util/logUtil';
import SpectreEmbed from '@util/SpectreEmbed';
import { formatTime, formatUser, removeBlankLines } from '@util/util';
import { Listener } from 'discord-akairo';
import { DMChannel, GuildChannel } from 'discord.js';

export default class ChannelDeleteListener extends Listener {
	public constructor() {
		super('channelDelete', {
			emitter: 'client',
			event: 'channelDelete',
		});
	}

	public async exec(channel: GuildChannel | DMChannel) {
		if (!('guild' in channel)) return;
		const { guild } = channel;
		const logChannel = Log.fetchChannel(guild, 'server');
		if (!logChannel) return;
		const entry = await Log.getEntry(guild, 'CHANNEL_DELETE');
		const executor = await Log.getExecutor({ guild, id: channel.id }, 'CHANNEL_DELETE', entry);
		const embed = new SpectreEmbed()
			.setAuthor(`Channel #${channel.name} was deleted`, emojis.deleteChannel)
			.setColor('RED')
			.setDescription(removeBlankLines`
				▫️ **Parent channel:** ${channel.parent ? `${channel.parent} (${channel.parentID})` : 'n/a'}
				▫️ **Created at:** ${formatTime(channel.createdAt)}
				${executor ? `▫️ **Deleted by:** ${formatUser(executor)}` : ''}
				${entry?.reason ? `▫️ **Reason:** ${entry.reason}` : ''}
				▫️ **Type:** \`${channel.type}\`
			`)
			.setFooter(`Channel ID: ${channel.id}`)
			.setTimestamp();
		logChannel.send(embed);
	}
}