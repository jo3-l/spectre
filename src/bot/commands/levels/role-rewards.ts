/* import { Command } from 'discord-akairo';
import { Message } from 'discord.js';
import { stripIndents } from 'common-tags';

export default class RoleRewardsCommand extends Command {
	public constructor() {
		super('role-rewards', {
			aliases: ['role-rewards'],
			category: 'Levels',
			description: {
				content: stripIndents`Command to help manage role rewards / level settings on the server. Only accessible by those with the Manage Server permission.

					**Avaliable Methods**
					• \`toggle type\` - This toggles `,
				usage: '<method> <...args>',
				examples: ['@Joe', ''],
			},
			clientPermissions: ['SEND_MESSAGES', 'ATTACH_FILES'],
			ratelimit: 1,
			args: [
				{
					'id': 'user',
					'type': 'user',
					'default': (message: Message) => message.author,
				},
			],
			channel: 'guild',
		});
	}
} */