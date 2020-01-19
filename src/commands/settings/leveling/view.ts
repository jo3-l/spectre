import SpectreEmbed from '@structures/SpectreEmbed';
import { CATEGORIES, CATEGORY_IMAGES } from '@util/constants';
import { capitalize } from '@util/util';
import { Command } from 'discord-akairo';
import { Message } from 'discord.js';

export default class ViewRoleRewardsCommand extends Command {
	public constructor() {
		super('role-rewards-view', {
			category: CATEGORIES.SETTINGS,
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
			.setThumbnail(CATEGORY_IMAGES[CATEGORIES.LEVELS])
			.setDescription(`${data}\n\n*❯ *Role giving configuration:**\n${type}`)
			.setFooter(guild.name);
		return message.util!.send(embed);
	}
}