import { Command } from 'discord-akairo';
import { Message } from 'discord.js';
import { CATEGORIES } from '@util/Constants';
const TWITCH_URL_REGEX = /(https?:\/\/)?(www\.)?twitch\.tv\/\S+/;

export default class SetStreamingCommand extends Command {
	public constructor() {
		super('set-streaming', {
			category: CATEGORIES.OWNER,
			optionFlags: ['--url', '-u'],
		});
	}

	public *args() {
		const status = yield { match: 'rest' };
		let url;
		if (status) {
			url = yield {
				'flag': ['--url', '-u'],
				'match': 'option',
				'type': (_: Message, phrase: string) => {
					if (TWITCH_URL_REGEX.test(phrase)) return phrase;
				},
				'default': 'https://www.twitch.tv/officialspectrebot',
			};
		}
		return { status, url };
	}

	public exec(message: Message, { status, url }: { status?: string; url?: string }) {
		if (!status) {
			this.client.activityHandler.start();
			return message.util!.send(`${this.client.emojis.success} Set status to default.`);
		}
		this.client.activityHandler.set(status, { type: 'STREAMING', url });
		message.util!.send(`${this.client.emojis.success} Set status to \`${status}\`.`);
	}
}