import { Listener } from 'discord-akairo';
import { ChannelPermission } from './channelUpdate';
import { MessageEmbed, GuildChannel } from 'discord.js';
import Log, { emojis } from '../../../structures/Log';
import { humanizePermissionName, removeBlankLines } from '../../../../util/Util';

export default class ChannelOverwriteCreateListener extends Listener {
	public constructor() {
		super('channelOverwriteCreate', {
			emitter: 'client',
			event: 'channelOverwriteCreate',
			category: 'Logs',
		});
	}

	public async exec(channel: GuildChannel, { allow, deny, target }: ChannelPermission) {
		const { guild } = channel;
		const logChannel = Log.fetchChannel(guild, 'server');
		if (!logChannel) return;
		const changes = [...allow, ...deny]
			.sort()
			.map(perm => {
				const emoji = allow.includes(perm) ? this.client.emojis.success : this.client.emojis.error;
				return `${emoji} ${humanizePermissionName(perm)}`;
			}).join('\n');
		const entry = await Log.getEntry(guild, 'CHANNEL_OVERWRITE_CREATE');
		const executor = await Log.getExecutor({ guild, id: channel.id }, 'CHANNEL_OVERWRITE_CREATE', entry);
		const embed = new MessageEmbed()
			.setAuthor(`Channel permissions in #${channel.name} were created`, emojis.updateChannel)
			.setColor('GREEN')
			.setTimestamp()
			.setFooter(`Channel ID: ${channel.id}`)
			.setDescription(removeBlankLines`
				▫️ **Parent channel:** ${channel.parent ? `${channel.parent} (${channel.parentID})` : 'n/a'}
				▫️ **Created at:** ${Log.formatTime(channel.createdAt)}
				${executor ? `▫️ **Overwrites created by:** ${Log.formatUser(executor)}` : ''}
				${entry?.reason ? `▫️ **Reason:** ${entry.reason}` : ''}
				▫️ **Type:** \`${channel.type}\`
				▫️ **Permission overwrites created:**
				${changes || 'n/a'}
				${target ? `▫️ **Target:** ${'tag' in target ? target.tag : target.name} (${target.id})` : ''}
			`);
		return Log.send(logChannel, embed);
	}
}