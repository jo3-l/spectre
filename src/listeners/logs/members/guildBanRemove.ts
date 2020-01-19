import SpectreEmbed from '@structures/SpectreEmbed';
import Log, { emojis } from '@util/logUtil';
import { formatUser } from '@util/util';
import { Listener } from 'discord-akairo';
import { Guild, User } from 'discord.js';

export default class GuildBanRemoveListener extends Listener {
	public constructor() {
		super('guildBanRemove', {
			emitter: 'client',
			event: 'guildBanRemove',
		});
	}

	public async exec(guild: Guild, user: User) {
		const channel = Log.fetchChannel(guild, 'members');
		if (!channel) return;
		const entry = await Log.getEntry(guild, 'MEMBER_BAN_REMOVE');
		const executor = await Log.getExecutor({ guild, id: user.id }, 'MEMBER_BAN_REMOVE', entry);
		const embed = new SpectreEmbed()
			.setAuthor(`${user.tag} was unbanned`, emojis.all)
			.setColor('GREEN')
			.setDescription(`
				▫️ **Unbanned by:** ${executor ? formatUser(executor) : 'Unknown#????'}
				${entry?.reason ? `▫️ **Reason:** ${entry.reason}` : ''}
			`)
			.setFooter(`User ID: ${user.id}`)
			.setTimestamp();
		channel.send(embed);
	}
}