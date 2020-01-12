import { Command } from 'discord-akairo';
import { Message } from 'discord.js';
import SpectreEmbed from '@structures/SpectreEmbed';
import { capitalize } from '@util/Util';

export default class ViewRoleRewardsCommand extends Command {
	public constructor() {
		super('role-rewards-view', {
			category: 'Settings',
		});
	}

	public async exec(message: Message) {
		const guild = message.guild!;
		const roleRewards = this.client.settings.get(guild, 'roleRewards');
		if (!roleRewards) return message.util!.reply('there are no role rewards set for this server.');
		const data = Object.entries(roleRewards)
			.sort(([a], [b]) => Number(a) - Number(b))
			.map(([level, reward]) => `\n• **Level ${level}.** \`${guild.roles.get(reward)?.name ?? 'Unknown role'}\``)
			.join('\n');
		const type = capitalize(this.client.settings.get(guild, 'rewardType', 'stack'));
		const embed = new SpectreEmbed()
			.setTitle('⚙️ Role Rewards')
			.setThumbnail(this.client.config.categoryImages.levels)
			.setDescription(`${data}\n\n*❯ *Role giving configuration:**\n${type}`)
			.setFooter(guild.name);
		return message.util!.send(embed);
	}
}