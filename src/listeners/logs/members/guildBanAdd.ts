import Log, { emojis } from '@util/logUtil';
import SpectreEmbed from '@util/SpectreEmbed';
import { formatUser } from '@util/util';
import { Listener } from 'discord-akairo';
import { Guild, User } from 'discord.js';

export default class GuildBanAddListener extends Listener {
	public constructor() {
		super('guildBanAdd', {
			emitter: 'client',
			event: 'guildBanAdd',
		});
	}

	public async exec(guild: Guild, user: User) {
		const channel = Log.fetchChannel(guild, 'members');
		if (!channel) return;
		const entry = await Log.getEntry(guild, 'MEMBER_BAN_ADD');
		const executor = await Log.getExecutor({ guild, id: user.id }, 'MEMBER_BAN_ADD', entry);
		const embed = new SpectreEmbed()
			.setAuthor(`${user.tag} was banned`, emojis.all)
			.setColor('RED')
			.setDescription(`
				▫️ **Banned by:** ${executor ? formatUser(executor) : 'Unknown#????'}
				${entry?.reason ? `▫️ **Reason:** ${entry.reason}` : ''}
			`)
			.setFooter(`User ID: ${user.id}`)
			.setTimestamp();
		channel.send(embed);
	}
}