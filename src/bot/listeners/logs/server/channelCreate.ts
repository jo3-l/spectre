import Log, { emojis } from '../../../structures/Log';
import { removeBlankLines } from '../../../../util/Util';
import { Listener } from 'discord-akairo';
import { GuildChannel, MessageEmbed, DMChannel } from 'discord.js';

export default class ChannelCreateListener extends Listener {
	public constructor() {
		super('channelCreate', {
			emitter: 'client',
			event: 'channelCreate',
			category: 'Logs',
		});
	}

	public async exec(channel: GuildChannel | DMChannel) {
		if (!('guild' in channel)) return;
		const { guild } = channel;
		const logChannel = Log.fetchChannel(guild, 'server');
		if (!logChannel) return;
		const entry = await Log.getEntry(guild, 'CHANNEL_CREATE');
		const executor = await Log.getExecutor({ guild, id: channel.id }, 'CHANNEL_CREATE', entry);
		const embed = new MessageEmbed()
			.setAuthor(`Channel #${channel.name} was created`, emojis.addChannel)
			.setColor('GREEN')
			.setDescription(removeBlankLines`
				▫️ **Parent channel:** ${channel.parent ? `${channel.parent} (${channel.parentID})` : 'n/a'}
				▫️ **Created at:** ${Log.formatTime(channel.createdAt)}
				${executor ? `▫️ **Created by:** ${Log.formatUser(executor)}` : ''}
				${entry?.reason ? `▫️ **Reason:** ${entry.reason}` : ''}
				▫️ **Type:** \`${channel.type}\`
			`)
			.setFooter(`Channel ID: ${channel.id}`)
			.setTimestamp();
		await Log.send(logChannel, embed);
	}
}