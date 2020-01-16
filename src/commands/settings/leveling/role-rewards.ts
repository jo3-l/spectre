import { Command, Flag } from 'discord-akairo';
import { Message } from 'discord.js';
import { stripIndents } from 'common-tags';

const base = 'role-rewards';

export default class RoleRewardsCommand extends Command {
	public constructor() {
		super('role-rewards', {
			aliases: ['role-rewards', 'rr'],
			category: 'Settings',
			description: {
				content: stripIndents`Command to help manage role rewards / level settings on the server.

					__Avaliable Methods__
					• \`set-type [stack|highest]\` - This sets the type of role-giving (or sets it). The two types are:
					
					1. \`stack\` (Roles will be given at the appropriate level and not removed)
					2. \`highest\` (Only the highest role reward that has been reached will be kept)

					• \`toggle-type\` - This toggles the type of role-giving.
					• \`add <level> <role>\` - Adds the role specified at the appropriate level.
					• \`remove <level>\` - Removes the role reward for the given level.
					• \`reset\` - Resets all the settings to default.
					• \`view\` - Views the current settings.`,
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