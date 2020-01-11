import { Command } from 'discord-akairo';
import { Message, GuildMember, PermissionString, MessageEmbed, Permissions } from 'discord.js';
import { humanizePermissionName } from '../../../util/Util';
import { oneLineTrim } from 'common-tags';


export default class ViewPermsCommand extends Command {
	public constructor() {
		super('view-perms', {
			aliases: ['view-perms', 'permissions', 'perms'],
			category: 'Info',
			description: {
				content: 'A list of permissions for a given member (defaults to yourself).',
				usage: '[member]',
				examples: ['@Joe', ''],
			},
			channel: 'guild',
			clientPermissions: ['EMBED_LINKS', 'SEND_MESSAGES'],
			args: [{ 'id': 'member', 'type': 'member', 'default': (msg: Message) => msg.member }],
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