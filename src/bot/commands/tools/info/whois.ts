import { Command } from 'discord-akairo';
import { Message, MessageEmbed, GuildMember } from 'discord.js';
import * as moment from 'moment';
import { oneLineCommaListsAnd } from 'common-tags';

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
			category: 'Info',
			description: {
				content: 'Displays information on a given user.',
				usage: '[user]',
				examples: ['', '@Joe'],
			},
			ratelimit: 2,
			channel: 'guild',
			clientPermissions: ['EMBED_LINKS'],
		});
	}

	public *args(message: Message) {
		let member = message.member;
		if (message.util!.parsed!.alias !== 'whoami') member = yield { 'type': 'member', 'default': (msg: Message) => msg.member };
		return { member };
	}

	public exec(message: Message, { member }: { member: GuildMember }) {
		const { user } = member;
		const embed = new MessageEmbed()
			.setAuthor(user.tag, user.displayAvatarURL())
			.setThumbnail(user.displayAvatarURL())
			.setColor(member.roles.highest ? member.roles.highest.color : this.client.config.color)
			.addField('ID', user.id)
			.addField('Nickname', member.nickname ?? 'None')
			.addField('Status', HUMAN_STATUSES[user.presence.status])
			.addField('Playing', user.presence?.activity?.name ?? 'None')
			.addField('Joined at', moment.utc(member.joinedAt!).format('YYYY/MM/DD hh:mm:ss'))
			.addField('Registered', moment.utc(user.createdAt).format('YYYY/MM/DD hh:mm:ss'))
			.addField(`Roles [${member.roles.size}]`, member.roles.map(role => `\`${role.name}\``).join(' ') || 'None');
		if (user.presence.clientStatus) {
			embed.setFooter(oneLineCommaListsAnd`${user.username} is active on 
				${Object.keys(user.presence.clientStatus ?? '')}`);
		}
		return message.util!.send(embed);
	}
}