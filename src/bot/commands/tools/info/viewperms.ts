import { Command } from 'discord-akairo';
import { Message, GuildMember, PermissionString, MessageEmbed, Permissions } from 'discord.js';
import { oneLineTrim } from 'common-tags';

function transformPermission(permission: PermissionString) {
	return permission
		.replace(/_/g, ' ')
		.split(' ')
		.map(word => (['VAD', 'TTS'].includes(word) && word) || `${word[0]}${word.substr(1).toLowerCase()}`)
		.join(' ');
}

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
			clientPermissions: ['EMBED_LINKS'],
			args: [{ 'id': 'member', 'type': 'member', 'default': (msg: Message) => msg.member }],
		});
	}

	public exec(message: Message, { member }: { member: GuildMember }) {
		const { permissions } = member;
		const humanReadable = [];
		for (const FLAG of (Object.keys(Permissions.FLAGS) as PermissionString[])) {
			humanReadable.push(oneLineTrim`${permissions.has(FLAG)
				? this.client.emojis.success
				: this.client.emojis.error} ${transformPermission(FLAG)}`);
		}
		const embed = new MessageEmbed()
			.setAuthor(`${member.user.tag}'s permissions`, member.user.displayAvatarURL())
			.setColor(member.displayColor || this.client.config.color)
			.setDescription(`${humanReadable.join('\n')}\n\nBitfield: \`${permissions.bitfield}\``)
			.setFooter(`Requested by ${message.author.tag}`);
		return message.util!.send(embed);
	}
}