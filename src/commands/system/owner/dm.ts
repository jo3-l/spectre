/* eslint-disable promise/prefer-await-to-then */
import { CATEGORIES } from '@util/constants';
import { Command } from 'discord-akairo';
import { Message, User } from 'discord.js';

export default class DmCommands extends Command {
	public constructor() {
		super('dm', {
			aliases: ['dm'],
			args: [
				{
					id: 'user',
					prompt: {
						retry: 'that was not a valid user. Try again.',
						start: 'please provide a user to DM.',
					},
					type: 'user',
				}, {
					id: 'content',
					prompt: { start: 'what would you like to DM the user?' },
					type: 'rest',
				},
			],
			category: CATEGORIES.OWNER,
			clientPermissions: ['SEND_MESSAGES'],
			description: {
				content: 'Owner-only command to DM a user.',
				examples: ['123456789 hello', '@JoeGamez how are you'],
				usage: '<user> <content>',
			},
			ownerOnly: true,
		});
	}

	public exec(message: Message, { user, content }: { user: User; content: string }) {
		user.send(content)
			.then(() => message.util!.send(`${this.client.emojis.success} Successfully DM'ed **${user.tag}**.`))
			.catch(() => message.util!.send(`${this.client.emojis.error} I was unable to DM the user.`));
	}
}