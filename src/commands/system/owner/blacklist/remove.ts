import { Command } from 'discord-akairo';
import { Message, User } from 'discord.js';
import { blacklistUserType } from './blacklist';
import { CATEGORIES } from '@util/constants';

export default class BlacklistAddCommand extends Command {
	public constructor() {
		super('blacklist-remove', {
			category: CATEGORIES.OWNER,
			args: [
				{
					id: 'user',
					type: blacklistUserType(false),
					prompt: {
						start: 'please provide a user ID to unblacklist.',
						retry: (_: Message, { failure }: { failure: { value: string } }) => {
							switch (failure.value) {
								case 'INVALID_USER':
								case 'PRESENT': return 'that user is not on the blacklist.';
								default: return 'that was not a valid user ID. Try again.';
							}
						},
					},
				},
			],
		});
	}

	public async exec(message: Message, { user }: { user: User }) {
		const blacklist = this.client.settings.get('global', 'blacklist', []);
		const index = blacklist.indexOf(user.id);
		if (index === -1) return message.util!.send(`${this.client.emojis.error} That user is not on the blacklist.`);
		blacklist.splice(index, 1);
		await this.client.settings.set('global', 'blacklist', blacklist);
		message.util!.send(`${this.client.emojis.success} Successfully unblacklisted **${user.tag}**!`);
	}
}