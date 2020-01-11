import { Listener } from 'discord-akairo';
import { UpdatedPermission } from './channelUpdate';
import { GuildChannel } from 'discord.js';
import Log, { emojis } from '@structures/Log';
import { humanizePermissionName, removeBlankLines } from '@util/Util';
import SpectreEmbed from '@structures/SpectreEmbed';

export default class ChannelOverwriteUpdateListener extends Listener {
	public constructor() {
		super('channelOverwriteUpdate', {
			emitter: 'client',
			event: 'channelOverwriteUpdate',
			category: 'Logs',
		});
	}

	public async exec(channel: GuildChannel, { outdated, updated, target }: UpdatedPermission) {
		const { guild } = channel;
		const logChannel = Log.fetchChannel(guild, 'server');
		if (!logChannel) return;
		let allow = updated.allow.missing(outdated.allow);
		let deny = updated.deny.missing(outdated.deny);
		if (!allow.length) allow = outdated.allow.missing(updated.allow);
		if (!deny.length) deny = outdated.deny.missing(updated.deny);
		const changes = [...allow, ...deny]
			.sort()
			.map(perm => {
				const old = outdated.allow.has(perm)
					? this.client.emojis.success
					: outdated.deny.has(perm) ? this.client.emojis.error : this.client.emojis.neutral;
				const current = updated.allow.has(perm)
					? this.client.emojis.success
					: updated.deny.has(perm) ? this.client.emojis.error : this.client.emojis.neutral;
				return `• \`${humanizePermissionName(perm)}\` ${old} ⇒ ${current}`;
			});
		const entry = await Log.getEntry(guild, 'CHANNEL_OVERWRITE_UPDATE');
		const executor = await Log.getExecutor({ guild, id: channel.id }, 'CHANNEL_OVERWRITE_UPDATE', entry);
		const embed = new SpectreEmbed()
			.setAuthor(`Channel permissions in #${channel.name} were updated`, emojis.updateChannel)
			.setColor('ORANGE')
			.setTimestamp()
			.setFooter(`Channel ID: ${channel.id}`)
			.setDescription(removeBlankLines`
					▫️ **Parent channel:** ${channel.parent ? `${channel.parent} (${channel.parentID})` : 'n/a'}
					▫️ **Created at:** ${Log.formatTime(channel.createdAt)}
					${executor ? `▫️ **Overwrites updated by:** ${Log.formatUser(executor)}` : ''}
					${entry?.reason ? `▫️ **Reason:** ${entry.reason}` : ''}
					▫️ **Type:** \`${channel.type}\`
					▫️ **Permission overwrites updated:**
					${changes}
					${target ? `▫️ **Target:** ${'tag' in target ? target.tag : target.name} (${target.id})` : ''}
				`);
		logChannel.send(embed);
	}
}