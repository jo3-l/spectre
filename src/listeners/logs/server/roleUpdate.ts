import { Listener } from 'discord-akairo';
import { Role } from 'discord.js';
import Log, { emojis } from '@util/logUtil';
import { stringify } from 'querystring';
import { removeBlankLines, humanizePermissionName, formatUser, formatTime } from '@util/util';
import SpectreEmbed from '@structures/SpectreEmbed';

export default class RoleUpdateListener extends Listener {
	public constructor() {
		super('roleUpdate', {
			event: 'roleUpdate',
			emitter: 'client',
		});
	}

	public async exec(oldRole: Role, newRole: Role) {
		const { guild } = newRole;
		const channel = await Log.fetchChannel(guild, 'server');
		if (!channel) return;
		const entry = await Log.getEntry(guild, 'ROLE_UPDATE');
		const executor = await Log.getExecutor({ guild, id: newRole.id }, 'ROLE_UPDATE', entry);
		let embed: SpectreEmbed | undefined;
		if (oldRole.name !== newRole.name) {
			embed = new SpectreEmbed()
				.setDescription(`
					▫️ **Old role name:** ${oldRole.name}
					▫️ **New role name:** ${newRole.name}
				`)
				.setAuthor(`Role ${oldRole.name}'s name was changed`);
		}
		if (!oldRole.permissions.equals(newRole.permissions)) {
			let perms = '';
			if (oldRole.permissions.has('ADMINISTRATOR') && newRole.permissions.has('ADMINISTRATOR')) {
				perms = `▫️ **Permissions:**
					\`${newRole.name}\` still has the \`Administrator\` permission, which grants all other permissions.`;
			} else if (!oldRole.permissions.has('ADMINISTRATOR') && newRole.permissions.has('ADMINISTRATOR')) {
				perms = `▫️ **Permissions gained:**
					\`${newRole.name}\` now has the \`Administrator\` permission, which grants all other permissions.`;
			} else if (oldRole.permissions.missing(newRole.permissions).length) {
				const data = oldRole.permissions.missing(newRole.permissions)
					.sort()
					.map(perm => `- \`${humanizePermissionName(perm)}\``)
					.join('\n');
				perms = `▫️ **Permissions gained:**
					${data}`;
			} else if (newRole.permissions.missing(oldRole.permissions).length) {
				const data = newRole.permissions.missing(oldRole.permissions)
					.sort()
					.map(perm => `- \`${humanizePermissionName(perm)}\``)
					.join('\n');
				perms = `▫️ **Permissions lost:**
					${data}`;
			}
			embed = new SpectreEmbed()
				.setDescription(perms)
				.setAuthor(`Role ${newRole.name}'s permissions were updated`);
		}
		if (oldRole.mentionable !== newRole.mentionable) {
			embed = new SpectreEmbed()
				.setDescription(`
					${executor ? `▫️ **${newRole.mentionable ? 'Enabled' : 'Disabled'} by:** ${formatUser(executor)}` : ''}
				`)
				.setColor(newRole.mentionable ? 'GREEN' : 'RED')
				.setAuthor(`Role ${newRole.name} is ${newRole.mentionable ? 'now' : 'no longer'} mentionable`);
		}
		if (oldRole.hoist !== newRole.hoist) {
			embed = new SpectreEmbed()
				.setDescription(`
					${executor ? `▫️ **${newRole.hoist ? 'Enabled' : 'Disabled'} by:** ${formatUser(executor)}` : ''}
				`)
				.setColor(newRole.hoist ? 'GREEN' : 'RED')
				.setAuthor(`Role ${newRole.name} is ${newRole.hoist ? 'now' : 'no longer'} hoisted`);
		}
		if (oldRole.color !== newRole.color) {
			embed = new SpectreEmbed()
				.setDescription(`
					▫️ **Old role color:** ${oldRole.color ? oldRole.hexColor : 'Default color'}
					▫️ **New role color:** ${newRole.color ? newRole.hexColor : 'Default color'}
				`)
				.setThumbnail(
					`https://dummyimage.com/400/${oldRole.hexColor.substr(1)}/ffffff/&${stringify({ text: 'Old color' })}`,
				)
				.setImage(
					`https://dummyimage.com/400/${newRole.hexColor.substr(1)}/ffffff/&${stringify({ text: 'New color' })}`,
				)
				.setAuthor(`Role ${oldRole.name}'s color was changed`);
		}
		if (!embed) return;
		const condition = oldRole.mentionable === newRole.mentionable && oldRole.hoist === newRole.hoist;
		embed.description = removeBlankLines`
				${(executor && condition) ? `▫️ **Updated by:** ${formatUser(executor)}` : ''}
				${entry?.reason ? `▫️ **Reason:** ${entry.reason}` : ''}
				▫️ **Timestamp of creation:** ${formatTime(newRole.createdAt)}
				${embed.description}
			`;
		embed.author!.iconURL = emojis.updateRole;
		if (!embed.color) embed.setColor('ORANGE');
		channel.send(embed.setFooter(`Role ID: ${newRole.id}`));
	}
}