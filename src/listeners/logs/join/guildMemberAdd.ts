import Log, { emojis } from '@structures/Log';
import { Listener } from 'discord-akairo';
import { GuildMember, User } from 'discord.js';
import SpectreEmbed from '@structures/SpectreEmbed';
import { formatTime, formatUser } from '@util/Util';

export default class GuildMemberAddListener extends Listener {
	public constructor() {
		super('guildMemberAdd', {
			emitter: 'client',
			event: 'guildMemberAdd',
		});
	}

	public async exec(member: GuildMember) {
		const channel = Log.fetchChannel(member.guild, 'join');
		if (!channel) return;
		const { user, guild } = member;
		let executor: User | undefined;
		if (user.bot) executor = await Log.getExecutor({ guild, id: user.id }, 'BOT_ADD');
		const embed = new SpectreEmbed()
			.setAuthor(`${user.tag} joined`, emojis.addMember)
			.setColor('GREEN')
			.setDescription(`
				▫️ **Account created at:** ${formatTime(user.createdAt)}
				▫️ **Avatar URL:** [View here](${user.displayAvatarURL()})
				▫️ **Bot account:** ${user.bot ? 'yes' : 'no'}
				${executor ? `▫️ **Invited by:** ${formatUser(executor)}` : ''}
				▫️ **Membercount:** ${guild.memberCount}
			`)
			.setFooter(`User ID: ${user.id}`)
			.setTimestamp();
		channel.send(embed);
	}
}