import { Listener } from 'discord-akairo';
import { Role, MessageEmbed } from 'discord.js';
import Log, { emojis } from '../../../structures/Log';
import { stringify } from 'querystring';
import { removeBlankLines } from '../../../../util/Util';

export default class RoleCreateListener extends Listener {
	public constructor() {
		super('roleCreate', {
			category: 'Logs',
			event: 'roleCreate',
			emitter: 'client',
		});
	}

	public async exec(role: Role) {
		const { guild } = role;
		const channel = await Log.fetchChannel(guild, 'server');
		if (!channel) return;
		const entry = await Log.getEntry(guild, 'ROLE_CREATE');
		const executor = await Log.getExecutor({ guild, id: role.id }, 'ROLE_CREATE', entry);
		const embed = new MessageEmbed()
			.setAuthor('A role was created', emojis.createRole)
			.setTimestamp()
			.setFooter(`Role ID: ${role.id}`)
			.setColor('GREEN')
			.setDescription(removeBlankLines`
				${executor ? `▫️ **Created by:** ${Log.formatUser(executor)}` : ''}
				${entry?.reason ? `▫️ **Reason:** ${entry.reason}` : ''}
				▫️ **Role:** \`${role.name}\` (${role.id})
				▫️ **Color:** ${role.color ? role.hexColor : 'Default color'}
				▫️ **Mentionable:** ${role.mentionable ? 'yes' : 'no'}
				▫️ **Hoisted:** ${role.hoist ? 'yes' : 'no'}
				▫️ **Role position:** ${Math.abs(role.position - guild.roles.size)}
				▫️ **Timestamp of creation:** ${Log.formatTime(role.createdAt)}
			`)
			.setThumbnail(`https://dummyimage.com/500/${role.hexColor.substr(1)}/ffffff/&${stringify({ text: 'Role color' })}`);
		Log.send(channel, embed);
	}
}