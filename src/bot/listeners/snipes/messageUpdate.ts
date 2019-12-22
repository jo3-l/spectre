import { Listener } from 'discord-akairo';
import { Message, User } from 'discord.js';

export default class MessageUpdateListener extends Listener {
	public constructor() {
		super('messageUpdate', {
			emitter: 'client',
			event: 'messageUpdate',
			category: 'Snipes',
		});
	}

	public exec(oldMessage: Message, newMessage: Message) {
		if (oldMessage.content === newMessage.content || !oldMessage.content) return;
		newMessage.channel.editSnipe = {
			author: newMessage.author,
			timestamp: newMessage.editedAt!,
			content: oldMessage.content,
		};
	}
}

declare module 'discord.js' {
	interface TextChannel { editSnipe: EditSnipe }
	interface DMChannel { editSnipe: EditSnipe }
}

interface EditSnipe {
	author: User;
	timestamp: Date;
	content: string;
}