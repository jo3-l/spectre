import { Command, Flag } from 'discord-akairo';
import { Message } from 'discord.js';
import { stripIndents } from 'common-tags';

export default class RoleRewardsCommand extends Command {
	public constructor() {
		super('role-rewards', {
			aliases: ['role-rewards', 'rr'],
			category: 'Settings',
			description: {
				content: stripIndents`Command to help manage role rewards / level settings on the server.

					**Avaliable Methods**
					• \`set-type [stack|highest]\` - This toggles the type of role-giving (or sets it). The two types are:

					1. \`stack\` (Roles will be given at the appropriate level and not removed)
					2. \`highest\` (Only the highest role reward that has been reached will be kept)

					• \`add <level> <role>\` - Adds the role specified at the appropriate level.
					• \`remove <level>\` - Removes the role reward for the given level.
					• \`reset\` - Resets all the settings to default.
					• \`view\` - Views the current settings.`,
				usage: '<method> <...args>',
				examples: ['set-type stack', 'add 10 Level 10+', 'remove 10', 'reset'],
			},
			clientPermissions: ['SEND_MESSAGES', 'EMBED_LINKS'],
			ratelimit: 1,
			channel: 'guild',
			userPermissions: ['MANAGE_GUILD'],
		});
	}

	public *args() {
		const method = yield {
			type: [
				['view-role-rewards', 'view'],
				['set-type-role-rewards', 'set-type'],
				['add-role-reward', 'add', 'create'],
				['remove-role-reward', 'remove', 'rm'],
				['reset-role-rewards', 'reset', 'clear'],
			],
			// eslint-disable-next-line max-len
			otherwise: (msg: Message) => `${msg.author}, that's not a valid method. Try the \`help role-rewards\` command for more information.`,
		};

		return Flag.continue(method);
	}
}