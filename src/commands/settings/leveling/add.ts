import { CATEGORIES } from '@util/constants';
import { Command, Flag } from 'discord-akairo';
import { Message, Role } from 'discord.js';

export default class AddRoleRewardCommand extends Command {
	public constructor() {
		super('role-rewards-add', {
			args: [
				{
					id: 'level',
					prompt: {
						retry: (_: Message, { failure }: { failure: { value: string } }) => {
							switch (failure.value) {
								// eslint-disable-next-line max-len
								case 'RANGE_ERROR': return 'Spectre does not support role rewards for levels less than 1 or higher than 300.';
								case 'ALREADY_PRESENT': return 'there is already a role reward for that level.';
								default: return 'please provide a valid level to add the role reward to.';
							}
						},
						start: 'please provide a level to add a role reward to.',
					},
					type: (message, level) => {
						if (!/^\d+$/.test(level)) return;
						if (Number(level) > 300 || Number(level) <= 0) return Flag.fail('RANGE_ERROR');
						const current = this.client.settings.get(message.guild!, 'roleRewards', {});
						if (level in current) return Flag.fail('ALREADY_PRESENT');
						return level;
					},
				},
				{
					id: 'reward',
					match: 'rest',
					prompt: { retry: 'that was not a valid role. Try again.', start: 'please provide a valid role.' },
					type: 'role',
				},
			],
			category: CATEGORIES.SETTINGS,
		});
	}

	public async exec(message: Message, { level, reward }: { level: string; reward: Role }) {
		const guild = message.guild!;
		const roleRewards = this.client.settings.get(guild, 'roleRewards', {});
		roleRewards[level] = reward.id;
		await this.client.settings.set(guild, 'roleRewards', roleRewards);
		// eslint-disable-next-line max-len
		return message.util!.send(`${this.client.emojis.success} Successfully set the role reward at ${level} to **${reward.name}**!`);
	}
}