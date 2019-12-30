import Log from '../../../structures/Log';
import { Listener } from 'discord-akairo';
import { Guild, User, MessageEmbed } from 'discord.js';

export default class GuildBanAddListener extends Listener {
	public constructor() {
		super('guildBanAdd', {
			emitter: 'client',
			event: 'guildBanAdd',
			category: 'Logs',
		});
	}

	public async exec(guild: Guild, user: User) {
		const channel = Log.fetchChannel(guild, 'members');
		if (!channel) return;
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