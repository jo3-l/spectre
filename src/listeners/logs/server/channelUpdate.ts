import SpectreEmbed from '@structures/SpectreEmbed';
import Log, { emojis } from '@util/logUtil';
import { formatTime, formatUser, removeBlankLines } from '@util/util';
import { Listener } from 'discord-akairo';
import { DMChannel, Guild, GuildChannel, Permissions, PermissionString, Role, TextChannel, User } from 'discord.js';

export interface ChannelPermission {
	allow: PermissionString[];
	deny: PermissionString[];
	target: Role | User | undefined;
}

export interface UpdatedPermission {
	outdated: { [key in 'allow' | 'deny']: Readonly<Permissions> };
	updated: { [key in 'allow' | 'deny']: Readonly<Permissions> };
	target: Role | User | undefined;
}

export default class ChannelUpdateListener extends Listener {
	public constructor() {
		super('channelUpdate', {
			emitter: 'client',
			event: 'channelUpdate',
		});
	}

	public async exec(oldChannel: GuildChannel | DMChannel, newChannel: GuildChannel | DMChannel) {
		if (!(oldChannel instanceof GuildChannel && newChannel instanceof GuildChannel)) return;
		const { guild } = newChannel;
		const logChannel = Log.fetchChannel(guild, 'server');
		if (!logChannel) return;

		const removedOverwrite = (oldChannel).permissionOverwrites
			.find(perm => !newChannel.permissionOverwrites.has(perm.id));
		if (removedOverwrite) {
			const data = {
				allow: removedOverwrite.allow.toArray(),
				deny: removedOverwrite.deny.toArray(),
				target: await this._resolve(removedOverwrite.id, guild),
			};
			return this.client.emit('channelOverwriteRemove', newChannel, data);
		}

		for (const [id, perm] of newChannel.permissionOverwrites) {
			const corresponding = oldChannel.permissionOverwrites.get(id);
			if (!corresponding) {
				const data = {
					allow: perm.allow.toArray(),
					deny: perm.deny.toArray(),
					target: await this._resolve(perm.id, guild),
				};
				return this.client.emit('channelOverwriteCreate', newChannel, data);
			}
			if (!corresponding.allow.equals(perm.allow) || !corresponding.deny.equals(perm.deny)) {
				const data = {
					outdated: { allow: corresponding.allow, deny: corresponding.deny },
					target: await this._resolve(perm.id, guild),
					updated: { allow: perm.allow, deny: perm.deny },
				};
				return this.client.emit('channelOverwriteUpdate', newChannel, data);
			}
		}

		const entry = await Log.getEntry(guild, 'CHANNEL_UPDATE');
		const executor = await Log.getExecutor({ guild, id: newChannel.id }, 'CHANNEL_UPDATE', entry);
		const nameChange = newChannel.name === oldChannel.name
			? ''
			: `▫️ **Old name:** ${oldChannel.name}\n▫️ **New name:** ${newChannel.name}`;
		let topicChange = '';
		if (oldChannel instanceof TextChannel && newChannel instanceof TextChannel && oldChannel.topic !== newChannel.topic) {
			topicChange = `▫️ **Old topic:** ${oldChannel.topic || 'n/a'}
				▫️ **New topic:** ${newChannel.topic || 'n/a'}`;
		}
		const embed = new SpectreEmbed()
			.setAuthor(`Channel #${newChannel.name} was updated`, emojis.updateChannel)
			.setColor('ORANGE')
			.setTimestamp()
			.setFooter(`Channel ID: ${newChannel.id}`)
			.setDescription(removeBlankLines`
					▫️ **Parent channel:** ${newChannel.parent ? `${newChannel.parent} (${newChannel.parentID})` : 'n/a'}
					▫️ **Created at:** ${formatTime(newChannel.createdAt)}
					${executor ? `▫️ **Updated by:** ${formatUser(executor)}` : ''}
					${nameChange}
					${entry?.reason ? `▫️ **Reason:** ${entry.reason}` : ''}
					${topicChange}
					▫️ **Type:** \`${newChannel.type}\`
				`);
		logChannel.send(embed);
	}

	private async _resolve(id: string, guild: Guild) {
		if (guild.roles.has(id)) return guild.roles.get(id)!;
		return this.client.users.fetch(id).catch(() => undefined);
	}
}