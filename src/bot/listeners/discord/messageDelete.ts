import { Listener } from 'discord-akairo';
import { Message, User } from 'discord.js';

export default class MessageDeleteListener extends Listener {
	public constructor() {
		super('messageDelete', {
			emitter: 'client',
			event: 'messageDelete',
			category: 'Discord',
		});
	}

	public exec(message: Message) {
		message.channel.snipe = {
			author: message.author,
			timestamp: message.createdAt,
			content: message.content,
			attachment: message.attachments.first()?.proxyURL ?? '',
		};
	}
}

interface ISnipe {
	author: User;
	timestamp: Date;
	content: string;
	attachment: string;
}

declare module 'discord.js' {
	interface TextChannel { snipe?: ISnipe }
	interface DMChannel { snipe?: ISnipe }
}