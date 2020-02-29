import { CATEGORIES } from '@util/constants';
import SpectreEmbed from '@util/SpectreEmbed';
import { commaListsAnd } from 'common-tags';
import { Command } from 'discord-akairo';
import { GuildMember, Message } from 'discord.js';
import moment from 'moment';

enum HUMAN_STATUSES {
	online = 'Online',
	idle = 'Idle',
	offline = 'Offline',
	dnd = 'Do Not Disturb',
}

export default class WhoisCommand extends Command {
	public constructor() {
		super('whois', {
			aliases: ['whois', 'whoami', 'user', 'user-info', 'member'],
			category: CATEGORIES.INFO,
			channel: 'guild',
			clientPermissions: ['EMBED_LINKS', 'SEND_MESSAGES'],
			description: {
				content: 'Displays information for a given user.',
				examples: ['', '@Joe'],
				usage: '[user]',
			},
			ratelimit: 2,
		});
	}

	public *args(message: Message) {
		let member = message.member;
		if (message.util!.parsed!.alias !== 'whoami') {
			member = yield { 'default': (msg: Message) => msg.member, 'type': 'member' };
		}
		return { member };
	}

	public exec(message: Message, { member }: { member: GuildMember }) {
		const { user } = member;
		const embed = new SpectreEmbed()
			.setAuthor(`${user.tag}${member.nickname ? ` (${member.nickname})` : ''}`, user.displayAvatarURL())
			.setThumbnail(user.displayAvatarURL())
			.setColor(member.displayColor || this.client.config.color)
			.addField('❯ ID', user.id)
			.addField('❯ Nickname', member.nickname ?? 'None')
			.addField('❯ Status', HUMAN_STATUSES[user.presence.status])
			.addField('❯ Playing', user.presence.activities[0]?.name ?? 'None')
			.addField('❯ Joined at', moment.utc(member.joinedAt!).format('YYYY/MM/DD hh:mm:ss'))
			.addField('❯ Registered', moment.utc(user.createdAt).format('YYYY/MM/DD hh:mm:ss'))
			.addField(
				`❯ Roles [${member.roles.cache.size}]`,
				member.roles.cache.map(role => `\`${role.name}\``).join(', ') || 'None',
			);

		if (user.presence.clientStatus) {
			embed.setFooter(commaListsAnd`${user.username} is active on ${Object.keys(user.presence.clientStatus)}`);
		}
		return message.util!.send(embed);
	}
}