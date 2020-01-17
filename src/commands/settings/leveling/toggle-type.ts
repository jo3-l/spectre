import { Command } from 'discord-akairo';
import { Message } from 'discord.js';
import { CATEGORIES } from '@util/constants';

export default class ToggleTypeRoleCommand extends Command {
	public constructor() {
		super('role-rewards-toggle-type', {
			category: CATEGORIES.SETTINGS,
		});
	}

	public async exec(message: Message) {
		const guild = message.guild!;
		const current = this.client.settings.get(guild, 'rewardType', 'stack');
		const type = current === 'stack' ? 'highest' : 'stack';
		await this.client.settings.set(guild, 'rewardType', type);
		// eslint-disable-next-line max-len
		return message.util!.send(`${this.client.emojis.success} Successfully set the role-giving type for this guild to ${type}!`);
	}
}