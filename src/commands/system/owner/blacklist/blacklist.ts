import { Command, Flag } from 'discord-akairo';
import { Message } from 'discord.js';
import { stripIndents } from 'common-tags';
import SpectreClient from '@root/src/client/SpectreClient';
import { CATEGORIES } from '@util/constants';

const base = 'blacklist';

export default class BlacklistCommand extends Command {
	public constructor() {
		super('blacklist', {
			aliases: ['blacklist', 'bk'],
			description: {
				content: stripIndents`Owner-only command to manage the global blacklist.
				
				__Avaliable Methods__
				• \`add <id>\` - Adds a user to the blacklist.
				• \`remove <id>\` - Removes a user from the blacklist.
				• \`status <id>\` - Check whether a user is on the blacklist.
				
				*If no method is provided, the method will default to the \`add\` command.*`,
				usage: '<method> <...arguments>',
				examples: [
					'add 12345678',
					'remove 12345678',
					'status 12345678',
				],
			},
			category: CATEGORIES.OWNER,
			clientPermissions: ['SEND_MESSAGES', 'EMBED_LINKS'],
			ownerOnly: true,
		});
	}

	public *args() {
		const method = yield {
			type: [
				['add'],
				['remove', 'rm'],
				['status'],
			],
			// eslint-disable-next-line max-len
			otherwise: (msg: Message) => `${msg.author}, that's not a valid method. Try the \`help blacklist\` command for more information.`,
		};

		return Flag.continue(`${base}-${method}`);
	}
}

export const blacklistUserType = (checkPresent = true) => async (message: Message, phrase: string) => {
	if (!phrase) return;
	if (!(/\d+/.test(phrase))) return;
	const user = await message.client.users.fetch(phrase).catch(() => null);
	if (!user) return;
	if ([message.client.user!.id, message.author.id].includes(user.id)) return Flag.fail('INVALID_USER');
	const included = (message.client as SpectreClient).settings.get('global', 'blacklist', [] as string[]).includes(user.id);
	if (checkPresent ? included : !included) return Flag.fail('PRESENT');
	return user;
};