import { Listener } from 'discord-akairo';
import { Message, User } from 'discord.js';

interface Snipe {
	author: User;
	timestamp: Date;
	content: string;
	attachment: string;
}

declare module 'discord.js' {
	interface TextChannel { snipe?: Snipe }
	interface DMChannel { snipe?: Snipe }
}

export default class MessageDeleteListener extends Listener {
	public constructor() {
		super('messageDelete', {
			emitter: 'client',
			event: 'messageDelete',
			category: 'Snipes',
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