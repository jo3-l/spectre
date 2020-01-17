import { Command } from 'discord-akairo';
import { Message, User } from 'discord.js';
import { blacklistUserType } from './blacklist';
import { CATEGORIES } from '@util/constants';

export default class BlacklistAddCommand extends Command {
	public constructor() {
		super('blacklist-add', {
			category: CATEGORIES.OWNER,
			args: [
				{
					id: 'user',
					type: blacklistUserType(),
					prompt: {
						start: 'please provide a user ID to blacklist.',
						retry: (_: Message, { failure }: { failure: { value: string } }) => {
							switch (failure.value) {
								// eslint-disable-next-line max-len
								case 'INVALID_USER': return 'I regret to inform you that you cannot blacklist either me or yourself. That makes two of us.';
								case 'PRESENT': return 'that user is already blacklisted.';
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
		blacklist.push(user.id);
		await this.client.settings.set('global', 'blacklist', blacklist);
		message.util!.send(`${this.client.emojis.success} Successfully blacklisted **${user.tag}**!`);
	}
}