import Log, { emojis } from '@structures/Log';
import { removeBlankLines, formatUser, formatTime } from '@util/Util';
import { Listener } from 'discord-akairo';
import { GuildMember } from 'discord.js';
import SpectreEmbed from '@structures/SpectreEmbed';

export default class GuildMemberRemoveListener extends Listener {
	public constructor() {
		super('guildMemberRemove', {
			emitter: 'client',
			event: 'guildMemberRemove',
			category: 'Logs',
		});
	}

	public async exec(member: GuildMember) {
		const channel = Log.fetchChannel(member.guild, 'join');
		if (!channel) return;
		const { user, guild } = member;
		const entry = await Log.getEntry(guild, 'MEMBER_KICK');
		const executor = await Log.getExecutor({ guild, id: member.id }, 'MEMBER_KICK', entry);
		const embed = new SpectreEmbed()
			.setAuthor(`${user.tag} ${executor ? 'was kicked' : 'left'}`, emojis.removeMember)
			.setColor('RED')
			.setDescription(removeBlankLines`
					${executor ? `**▫️ Kicked by:** ${formatUser(executor)}` : ''}
					${executor && entry?.reason ? `**▫️ Reason:** ${entry.reason}` : ''}
					▫️ **Account created at:** ${formatTime(user.createdAt)}
					▫️ **Joined guild at:** ${formatTime(member.joinedAt!)}
					▫️ **Avatar URL:** [View here](${user.displayAvatarURL()})
					▫️ **Bot account:** ${user.bot ? 'yes' : 'no'}
					▫️ **Membercount:** ${guild.memberCount}
				`)
			.setFooter(`User ID: ${user.id}`)
			.setTimestamp();
		channel.send(embed);
	}
}