import { Command, Flag } from 'discord-akairo';
import { Message } from 'discord.js';
import { stripIndents } from 'common-tags';
import { CATEGORIES } from '@util/constants';

const base = 'role-rewards';

export default class RoleRewardsCommand extends Command {
	public constructor() {
		super('settings', {
			aliases: ['settings', 'configuration', 'conf'],
			category: CATEGORIES.SETTINGS,
			description: {
				content: stripIndents`Command to help manage guild settings.

					__Avaliable Methods__
					• \`set <key> <value\` - Sets a setting.
					• \`delete <key>\` - Resets a setting to its default.
					• \`clear\` - Resets all of the server settings to default.
					• \`toggle <key>\` - Toggles a given setting (must be toggleable).
					• \`view\` - Views the server settings.

					__Avaliable 
				`,
				usage: '<method> <...args>',
				examples: ['set-type stack', 'add 10 Level 10+', 'remove 10', 'reset'],
			},
			clientPermissions: ['SEND_MESSAGES', 'EMBED_LINKS'],
			channel: 'guild',
			userPermissions: ['MANAGE_GUILD'],
		});
	}

	public *args() {
		const method = yield {
			type: [
				['view'],
				['set-type'],
				['add', 'create'],
				['remove', 'rm'],
				['reset', 'clear', 'delete'],
				['toggle-type'],
			],
			// eslint-disable-next-line max-len
			otherwise: (msg: Message) => `${msg.author}, that's not a valid method. Try the \`help role-rewards\` command for more information.`,
		};

		return Flag.continue(`${base}-${method}`);
	}
}