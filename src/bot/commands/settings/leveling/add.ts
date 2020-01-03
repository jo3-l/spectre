import { Command, Flag } from 'discord-akairo';
import { Message, Role } from 'discord.js';

export default class AddRoleRewardCommand extends Command {
	public constructor() {
		super('role-rewards-add', {
			category: 'Settings',
			args: [
				{
					id: 'level',
					type: (message, level) => {
						if (!/^\d+$/.test(level)) return;
						if (Number(level) > 300 || Number(level) <= 0) return Flag.fail('RANGE_ERROR');
						const current = this.client.settings.get(message.guild!, 'roleRewards', {});
						if (level in current) return Flag.fail('ALREADY_PRESENT');
						return level;
					},
					prompt: {
						start: 'please provide a level to add a role reward to.',
						retry: (_: Message, { failure }: { failure: { value: string } }) => {
							switch (failure.value) {
								// eslint-disable-next-line max-len
								case 'RANGE_ERROR': return 'Spectre does not support role rewards for levels less than 1 or higher than 300.';
								case 'ALREADY_PRESENT': return 'there is already a role reward for that level.';
								default: return 'please provide a valid level to add the role reward to.';
							}
						},
					},
				},
				{
					id: 'reward',
					match: 'restContent',
					type: 'role',
					prompt: { start: 'please provide a valid role.', retry: 'that was not a valid role. Try again.' },
				},
			],
		});
	}

	public async exec(message: Message, { level, reward }: { level: string; reward: Role }) {
		const guild = message.guild!;
		const roleRewards = this.client.settings.get(guild, 'roleRewards', {} as { [key: string]: string });
		roleRewards[level] = reward.id;
		await this.client.settings.set(guild, 'roleRewards', roleRewards);
		// eslint-disable-next-line max-len
		return message.util!.send(`${this.client.emojis.success} Successfully set the role reward at ${level} to **${reward.name}**!`);
	}
}