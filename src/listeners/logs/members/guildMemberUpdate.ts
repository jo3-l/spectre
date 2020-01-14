import Log, { emojis } from '@structures/Log';
import { removeBlankLines, humanizePermissionName, formatUser } from '@util/Util';
import { Listener } from 'discord-akairo';
import { GuildMember, PermissionString } from 'discord.js';
import SpectreEmbed from '@structures/SpectreEmbed';

export default class GuildMemberUpdateListener extends Listener {
	public constructor() {
		super('guildMemberUpdate', {
			emitter: 'client',
			event: 'guildMemberUpdate',
			category: 'Logs',
		});
	}

	public async exec(oldMember: GuildMember, newMember: GuildMember) {
		const { guild, user } = newMember;
		const channel = Log.fetchChannel(guild, 'members');
		if (!channel) return;
		if (oldMember.displayName !== newMember.displayName) {
			const entry = await Log.getEntry(guild, 'MEMBER_UPDATE');
			const executor = await Log.getExecutor({ guild, id: user.id }, 'MEMBER_UPDATE', entry);
			const embed = new SpectreEmbed()
				.setAuthor(`${user.tag}'s nickname was changed`, user.displayAvatarURL())
				.setColor('ORANGE')
				.setDescription(removeBlankLines`
					▫️ **Changed by:** ${formatUser(executor ?? user)}
					${entry?.reason ? `▫️ **Reason:** ${entry.reason}` : ''}
					▫️ **Old nickname:** ${oldMember.displayName}
					▫️ **New nickname:** ${newMember.displayName}
					▫️ **Member:** ${formatUser(user)}
				`)
				.setFooter(`User ID: ${user.id}`)
				.setTimestamp();
			channel.send(embed);
		}

		if (oldMember.roles.size !== newMember.roles.size) {
			const roleRemoved = oldMember.roles.size > newMember.roles.size;
			const entry = await Log.getEntry(guild, 'MEMBER_ROLE_UPDATE');
			const executor = await Log.getExecutor({ guild, id: user.id }, 'MEMBER_ROLE_UPDATE', entry);
			const role = roleRemoved
				? oldMember.roles.find(({ id }) => !newMember.roles.has(id))!
				: newMember.roles.find(({ id }) => !oldMember.roles.has(id))!;
			if (!role) return;
			let permissionsAdded: string | PermissionString[] = oldMember.permissions.missing(newMember.permissions);
			let permissionsRemoved: string | PermissionString[] = newMember.permissions.missing(oldMember.permissions);
			const adminChanged = newMember.permissions.bitfield === 8 && oldMember.permissions.bitfield !== 8;
			if (permissionsAdded.length && !adminChanged) {
				permissionsAdded = permissionsAdded
					.map(item => `• \`${humanizePermissionName(item)}\``).join('\n');
			} else if (permissionsRemoved.length && !adminChanged) {
				permissionsRemoved = permissionsRemoved
					.map(item => `• \`${humanizePermissionName(item)}\``).join('\n');
			}
			permissionsAdded = Array.isArray(permissionsAdded) ? '' : permissionsAdded;
			permissionsRemoved = Array.isArray(permissionsRemoved) ? '' : permissionsRemoved;
			/* eslint-disable */
			const perms = `▫️ **Permissions ${roleRemoved ? 'lost' : 'gained'}:**
				${adminChanged ? '• `Administrator` (All other permissions are granted)' : permissionsAdded || permissionsRemoved || 'n/a'}`;
			/* eslint-enable */
			const embed = new SpectreEmbed()
				.setAuthor(`Role was ${roleRemoved ? 'removed from' : 'added to'} ${user.tag}`, emojis.updateMember)
				.setColor(roleRemoved ? 'RED' : 'GREEN')
				.setFooter(`Member ID: ${user.id}`)
				.setTimestamp()
				.setDescription(removeBlankLines`
					${executor ? `▫️ **${roleRemoved ? 'Removed' : 'Added'} by:** ${formatUser(executor)}` : ''}
					${entry?.reason ? `▫️ **Reason:** ${entry.reason}` : ''}
					▫️ **Role ${roleRemoved ? 'removed' : 'added'}:** ${role} (ID ${role.id})
					▫️ **Member:** ${formatUser(user)}
					${perms}
				`);
			channel.send(embed);
		}
	}
}