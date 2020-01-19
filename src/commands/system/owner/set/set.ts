import { CATEGORIES } from '@util/constants';
import { stripIndents } from 'common-tags';
import { Command, Flag } from 'discord-akairo';
import { Message } from 'discord.js';

const base = 'set';

export default class SetCommand extends Command {
	public constructor() {
		super('set', {
			aliases: ['set'],
			category: CATEGORIES.OWNER,
			clientPermissions: ['SEND_MESSAGES'],
			description: {
				content: stripIndents`Owner-only command to set some bot properties such as activity, status, etc.
				
				__Avaliable Methods__
				• \`streaming <activity> [--url: Twitch URL]\` - Sets the streaming activity for Spectre with optional URL.
				• \`watching|playing|listening [activity]\` - Sets the corresponding activity for Spectre.
				• \`status [status]\` - Sets the status for Spectre (dnd, invisible, etc.)`,
				examples: [
					'playing Hello there',
					'watching you',
					'streaming You are a bold one',
					'streaming I have the high ground --url some_sketchy_link.com',
					'listening to 1337 tunes',
					'status DND',
				],
				usage: '<method> <...arguments>',
			},
			ownerOnly: true,
		});
	}

	public *args() {
		const method = yield {
			otherwise: (msg: Message) =>
				`${msg.author}, that's not a valid method. Try the \`help set\` command for more information.`,
			type: [
				['playing'],
				['watching'],
				['streaming'],
				['listening'],
				['status'],
			],
		};

		return Flag.continue(`${base}-${method}`);
	}
}