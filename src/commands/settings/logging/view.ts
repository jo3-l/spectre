import SpectreEmbed from '@structures/SpectreEmbed';
import { CATEGORIES, CATEGORY_IMAGES } from '@util/constants';
import { capitalize } from '@util/util';
import { Command } from 'discord-akairo';
import { Message } from 'discord.js';

export default class ViewRoleRewardsCommand extends Command {
	public constructor() {
		super('logs-view', {
			category: CATEGORIES.SETTINGS,
		});
	}

	public async exec(message: Message) {
		const guild = message.guild!;
		const logSettings = this.client.settings.get(guild, 'logs');
		if (!logSettings || !Object.values(logSettings).filter(Boolean).length) {
			return message.util!.reply('there are no log settings set for this server.');
		}
		const data = Object.entries(logSettings)
			.map(([type, channel]) => `• **${capitalize(type)}:** ${guild.channels.get(channel as string) ?? 'Unknown channel'}`);
		const embed = new SpectreEmbed()
			.setTitle('⚙️ Log Settings')
			.setThumbnail(CATEGORY_IMAGES[CATEGORIES.SETTINGS])
			.setDescription(data)
			.setFooter(guild.name);
		return message.util!.send(embed);
	}
}