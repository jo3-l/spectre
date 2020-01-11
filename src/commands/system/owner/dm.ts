/* eslint-disable promise/prefer-await-to-then */
import { Command } from 'discord-akairo';
import { User, Message } from 'discord.js';

export default class DmCommands extends Command {
	public constructor() {
		super('dm', {
			aliases: ['dm'],
			category: 'Owner',
			description: {
				content: 'Owner-only command to DM a user.',
				usage: '<user> <content>',
				examples: ['123456789 hello', '@JoeGamez how are you'],
			},
			ownerOnly: true,
			args: [
				{
					id: 'user',
					prompt: {
						start: 'please provide a user to DM.',
						retry: 'that was not a valid user. Try again.',
					},
					type: 'user',
				}, {
					id: 'content',
					type: 'rest',
					prompt: { start: 'what would you like to DM the user?' },
				},
			],
			clientPermissions: ['SEND_MESSAGES'],
		});
	}

	public exec(message: Message, { user, content }: { user: User; content: string }) {
		user.send(content)
			.then(() => message.util!.send(`${this.client.emojis.success} Successfully DM'ed **${user.tag}**.`))
			.catch(() => message.util!.send(`${this.client.emojis.error} I was unable to DM the user.`));
	}
}