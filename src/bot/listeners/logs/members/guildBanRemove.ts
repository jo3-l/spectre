import Log, { emojis } from '../../../structures/Log';
import { Listener } from 'discord-akairo';
import { Guild, User, MessageEmbed } from 'discord.js';

export default class GuildBanRemoveListener extends Listener {
	public constructor() {
		super('guildBanRemove', {
			emitter: 'client',
			event: 'guildBanRemove',
			category: 'Logs',
		});
	}

	public async exec(guild: Guild, user: User) {
		const channel = Log.fetchChannel(guild, 'members');
		if (!channel) return;
		const entry = await Log.getEntry(guild, 'MEMBER_BAN_REMOVE');
		const executor = await Log.getExecutor({ guild, id: user.id }, 'MEMBER_BAN_REMOVE', entry);
		const embed = new MessageEmbed()
			.setAuthor(`${user.tag} was unbanned`, emojis.all)
			.setColor('GREEN')
			.setDescription(`
				▫️ **Unbanned by:** ${executor ? Log.formatUser(executor) : 'Unknown#????'}
				${entry?.reason ? `▫️ **Reason:** ${entry.reason}` : ''}
			`)
			.setFooter(`User ID: ${user.id}`)
			.setTimestamp();
		await Log.send(channel, embed);
	}
}