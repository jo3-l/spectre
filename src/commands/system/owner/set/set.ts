import { Command, Flag } from 'discord-akairo';
import { Message } from 'discord.js';
import { stripIndents } from 'common-tags';
import { CATEGORIES } from '@util/Constants';

const base = 'set';

export default class SetCommand extends Command {
	public constructor() {
		super('set', {
			aliases: ['set'],
			description: {
				content: stripIndents`Owner-only command to set some bot properties such as activity, status, etc.
				
				__Avaliable Methods__
				• \`streaming <activity> [--url: Twitch URL]\` - Sets the streaming activity for Spectre with optional URL.
				• \`watching|playing|listening [activity]\` - Sets the corresponding activity for Spectre.
				• \`status [status]\` - Sets the status for Spectre (dnd, invisible, etc.)`,
				usage: '<method> <...arguments>',
				examples: [
					'playing Hello there',
					'watching you',
					'streaming You are a bold one',
					'streaming I have the high ground --url some_sketchy_link.com',
					'listening to 1337 tunes',
					'status DND',
				],
			},
			category: CATEGORIES.OWNER,
			clientPermissions: ['SEND_MESSAGES'],
			ownerOnly: true,
		});
	}

	public *args() {
		const method = yield {
			type: [
				['playing'],
				['watching'],
				['streaming'],
				['listening'],
				['status'],
			],
			// eslint-disable-next-line max-len
			otherwise: (msg: Message) => `${msg.author}, that's not a valid method. Try the \`help set\` command for more information.`,
		};

		return Flag.continue(`${base}-${method}`);
	}
}