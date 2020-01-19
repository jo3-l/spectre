import { CATEGORIES } from '@util/constants';
import { stripIndents } from 'common-tags';
import { Command, Flag } from 'discord-akairo';
import { Message } from 'discord.js';

const base = 'logs';

export default class LoggingCommand extends Command {
	public constructor() {
		super('logging', {
			aliases: ['logging', 'logs'],
			category: CATEGORIES.SETTINGS,
			channel: 'guild',
			clientPermissions: ['SEND_MESSAGES', 'EMBED_LINKS'],
			description: {
				content: stripIndents`Command to help manage logging settings on the server.

					__Avaliable Methods__
					• \`add <type> <channel>\` - Adds the type of log specified to the appropriate channel. Valid types are:

					1. \`joinlog\` - Join and leave logs
					2. \`memberlog\` - Member updates (added roles, etc)
					3. \`messagelog\` - Message-related logs (edits, deletions, bulk deletes)
					4. \`serverlog\` - Changes to the server itself.
					5. \`voicelog\` - Voice-related logs (leaving voice channel, switching, joining, etc.)
					6. \`all\` - All logs.

					• \`remove <type>\` - Removes the log specified from the channel set.
					• \`reset\` - Resets all the settings to default.
					• \`view\` - Views the current settings.`,
				examples: ['add joinlogs #join-logs', 'remove joinlogs', 'reset', 'view'],
				usage: '<method> <...args>',
			},
			userPermissions: ['MANAGE_GUILD'],
		});
	}

	public *args() {
		const method = yield {
			otherwise: (msg: Message) =>
				`${msg.author}, that's not a valid method. Try the \`help logging\` command for more information.`,
			type: [
				['add', 'set', 'create'],
				['remove', 'rm'],
				['reset', 'clear'],
				['view'],
			],
		};

		return Flag.continue(`${base}-${method}`);
	}
}