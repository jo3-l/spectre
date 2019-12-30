import { Command } from 'discord-akairo';
import { Message, MessageEmbed } from 'discord.js';

const capitalize = (word: string) => `${word[0].toUpperCase()}${word.substr(1)}`;

export default class ViewRoleRewardsCommand extends Command {
	public constructor() {
		super('view-logs', {
			category: 'Settings',
		});
	}

	public async exec(message: Message) {
		const guild = message.guild!;
		const logSettings = this.client.settings.get(guild, 'logs');
		this.logger.debug(logSettings);
		if (!logSettings || !Object.values(logSettings).filter(Boolean).length) {
			return message.util!.reply('there are no log settings set for this server.');
		}
		const data = Object.entries(logSettings)
			.map(([type, channel]) => `• **${capitalize(type)}:** ${guild.channels.get(channel as string) ?? 'Unknown channel'}`);
		const embed = new MessageEmbed()
			.setTitle('📋 Log Settings')
			.setColor(this.client.config.color)
			.setThumbnail(this.client.config.categoryImages.settings)
			.setDescription(data)
			.setFooter(guild.name);
		return message.util!.send(embed);
	}
}