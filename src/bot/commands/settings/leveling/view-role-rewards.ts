import { Command } from 'discord-akairo';
import { Message, MessageEmbed } from 'discord.js';

const capitalize = (word: string) => `${word[0].toUpperCase()}${word.substr(1)}`;

export default class ViewRoleRewardsCommand extends Command {
	public constructor() {
		super('view-role-rewards', {
			category: 'Settings',
		});
	}

	public async exec(message: Message) {
		const guild = message.guild!;
		const roleRewards = this.client.settings.get(guild, 'roleRewards');
		if (!roleRewards) return message.util!.reply('there are no role rewards set for this server.');
		const data = Object.entries(roleRewards)
			.sort(([a], [b]) => Number(a) - Number(b))
			// eslint-disable-next-line max-len
			.reduce((prev, [level, reward]) => prev += `\n• **Level ${level}.** \`${guild.roles.get(reward)?.name ?? 'Unknown role'}\``, '');
		const embed = new MessageEmbed()
			.setTitle('📋 Role Rewards')
			.setColor(this.client.config.color)
			.setThumbnail(this.client.config.categoryImages.levels)
			// eslint-disable-next-line max-len
			.setDescription(`${data}\n\n\`Role Rewards Type:\` ${capitalize(this.client.settings.get(guild, 'rewardType', 'stack'))}`)
			.setFooter(guild.name);
		return message.util!.send(embed);
	}
}