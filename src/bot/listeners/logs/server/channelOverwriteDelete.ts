import { Listener } from 'discord-akairo';
import { ChannelPermission } from './channelUpdate';
import { MessageEmbed, GuildChannel } from 'discord.js';
import Log, { emojis } from '../../../structures/Log';
import { humanizePermissionName, removeBlankLines } from '../../../../util/Util';

export default class ChannelOverwriteDeleteListener extends Listener {
	public constructor() {
		super('channelOverwriteDelete', {
			emitter: 'client',
			event: 'channelOverwriteDelete',
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
		const entry = await Log.getEntry(guild, 'CHANNEL_OVERWRITE_DELETE');
		const executor = await Log.getExecutor({ guild, id: channel.id }, 'CHANNEL_OVERWRITE_DELETE', entry);
		const embed = new MessageEmbed()
			.setAuthor(`Channel permissions in #${channel.name} were deleted`, emojis.updateChannel)
			.setColor('RED')
			.setTimestamp()
			.setFooter(`Channel ID: ${channel.id}`)
			.setDescription(removeBlankLines`
				▫️ **Parent channel:** ${channel.parent ? `${channel.parent} (ID ${channel.parentID})` : 'n/a'}
				▫️ **Created at:** ${Log.formatTime(channel.createdAt)}
				${executor ? `▫️ **Overwrites deleted by:** ${Log.formatUser(executor)}` : ''}
				${entry?.reason ? `▫️ **Reason:** ${entry.reason}` : ''}
				▫️ **Type:** \`${channel.type}\`
				▫️ **Permission overwrites deleted:**
				${changes || 'n/a'}
				${target ? `▫️ **Target:** ${'tag' in target ? target.tag : target.name} (ID ${target.id})` : ''}
			`);
		return Log.send(logChannel, embed);
	}
}