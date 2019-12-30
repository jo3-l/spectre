import Log from '../../../structures/Log';
import { Listener } from 'discord-akairo';
import { GuildMember, MessageEmbed } from 'discord.js';

export default class GuildMemberAddListener extends Listener {
	public constructor() {
		super('guildMemberAdd', {
			emitter: 'client',
			event: 'guildMemberAdd',
			category: 'Logs',
		});
	}

	public async exec(member: GuildMember) {
		const channel = Log.fetchChannel(member.guild, 'join');
		if (!channel) return;
		const { user, guild } = member;
		const embed = new MessageEmbed()
			.setAuthor(`${user.tag} joined`, user.displayAvatarURL())
			.setColor('GREEN')
			.setDescription(`
				**Account created at:** ${Log.formatTime(user.createdAt)}
				**Membercount:** ${guild.memberCount}
			`)
			.setFooter(`User ID: ${user.id}`)
			.setTimestamp();
		await Log.send(channel, embed);
	}
}