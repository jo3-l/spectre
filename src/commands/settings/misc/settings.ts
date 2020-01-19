import { CATEGORIES } from '@util/constants';
import { stripIndents } from 'common-tags';
import { Command, Flag } from 'discord-akairo';
import { Message } from 'discord.js';

const base = 'role-rewards';

export default class RoleRewardsCommand extends Command {
	public constructor() {
		super('settings', {
			aliases: ['settings', 'configuration', 'conf'],
			category: CATEGORIES.SETTINGS,
			channel: 'guild',
			clientPermissions: ['SEND_MESSAGES', 'EMBED_LINKS'],
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
				examples: ['set-type stack', 'add 10 Level 10+', 'remove 10', 'reset'],
				usage: '<method> <...args>',
			},
			userPermissions: ['MANAGE_GUILD'],
		});
	}

	public *args() {
		const method = yield {
			otherwise: (msg: Message) =>
				`${msg.author}, that's not a valid method. Try the \`help role-rewards\` command for more information.`,
			type: [
				['view'],
				['set-type'],
				['add', 'create'],
				['remove', 'rm'],
				['reset', 'clear', 'delete'],
				['toggle-type'],
			],
		};

		return Flag.continue(`${base}-${method}`);
	}
}