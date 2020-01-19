import { CATEGORIES } from '@util/constants';
import { oneLineTrim } from 'common-tags';
import { Command } from 'discord-akairo';
import { GuildMember, Message, MessageEmbed, Permissions, PermissionString } from 'discord.js';

import { humanizePermissionName } from '../../../util/util';


export default class ViewPermsCommand extends Command {
	public constructor() {
		super('view-perms', {
			aliases: ['view-perms', 'permissions', 'perms'],
			args: [{ 'default': (msg: Message) => msg.member, 'id': 'member', 'type': 'member' }],
			category: CATEGORIES.INFO,
			channel: 'guild',
			clientPermissions: ['EMBED_LINKS', 'SEND_MESSAGES'],
			description: {
				content: 'A list of permissions for a given member (defaults to yourself).',
				examples: ['@Joe', ''],
				usage: '[member]',
			},
		});
	}

	public exec(message: Message, { member }: { member: GuildMember }) {
		const { permissions } = member;
		const humanReadable = [];
		for (const flag of (Object.keys(Permissions.FLAGS) as PermissionString[]).sort()) {
			humanReadable.push(oneLineTrim`${permissions.has(flag)
				? this.client.emojis.success
				: this.client.emojis.error} ${humanizePermissionName(flag)}`);
		}
		const embed = new MessageEmbed()
			.setAuthor(`${member.user.tag}'s permissions`, member.user.displayAvatarURL())
			.setColor(member.displayColor || this.client.config.color)
			.setDescription(`${humanReadable.join('\n')}\n\nBitfield: \`${permissions.bitfield}\``)
			.setFooter(`Requested by ${message.author.tag}`);
		return message.util!.send(embed);
	}
}