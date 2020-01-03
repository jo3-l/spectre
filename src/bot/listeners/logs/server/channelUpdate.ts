import Log from '../../../structures/Log';
import { removeBlankLines } from '../../../../util/Util';
import { Listener } from 'discord-akairo';
import { GuildChannel, MessageEmbed, DMChannel, PermissionString, Guild, TextChannel, Permissions, User, Role } from 'discord.js';

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
			category: 'Logs',
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
				target: await this.resolve(removedOverwrite.id, guild),
			};
			return this.client.emit('channelOverwriteRemove', newChannel, data);
		}

		for (const [id, perm] of newChannel.permissionOverwrites) {
			const corresponding = oldChannel.permissionOverwrites.get(id);
			if (!corresponding) {
				const data = {
					allow: perm.allow.toArray(),
					deny: perm.deny.toArray(),
					target: await this.resolve(perm.id, guild),
				};
				return this.client.emit('channelOverwriteCreate', newChannel, data);
			}
			if (!corresponding.allow.equals(perm.allow) || !corresponding.deny.equals(perm.deny)) {
				const data = {
					outdated: { allow: corresponding.allow, deny: corresponding.deny },
					updated: { allow: perm.allow, deny: perm.deny },
					target: await this.resolve(perm.id, guild),
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
		const embed = new MessageEmbed()
			.setAuthor(`Channel #${newChannel.name} was updated`, guild.iconURL() || '')
			.setColor('ORANGE')
			.setTimestamp()
			.setFooter(`Channel ID: ${newChannel.id}`)
			.setDescription(removeBlankLines`
					▫️ **Parent channel:** ${newChannel.parent ? `${newChannel.parent} (ID ${newChannel.parentID})` : 'n/a'}
					▫️ **Created at:** ${Log.formatTime(newChannel.createdAt)}
					${executor ? `▫️ **Updated by:** ${Log.formatUser(executor)}` : ''}
					${nameChange}
					${entry?.reason ? `▫️ **Reason:** ${entry.reason}` : ''}
					${topicChange}
					▫️ **Type:** \`${newChannel.type}\`
				`);
		return Log.send(logChannel, embed);
	}

	private async resolve(id: string, guild: Guild) {
		if (guild.roles.has(id)) return guild.roles.get(id)!;
		return this.client.users.fetch(id).catch(() => undefined);
	}
}