import { Command, Argument, ListenerHandler, InhibitorHandler, CommandHandler } from 'discord-akairo';
import { Message } from 'discord.js';
import { stripIndents } from 'common-tags';

export default class ReloadAllCommand extends Command {
	public constructor() {
		super('reload-all', {
			aliases: ['reload-all'],
			category: 'Owner',
			description: {
				content: 'Reloads all in a specific type. The `-n` flag will load new modules instead of just reloading.',
				usage: '<type> [-n]',
				examples: ['commands', 'inhibitors -n'],
			},
			ownerOnly: true,
			clientPermissions: ['SEND_MESSAGES'],
			ratelimit: 2,
			flags: ['-n', '--new'],
		});
	}

	public *args() {
		let name = '';
		const handler = yield {
			type: Argument.compose([['commands', 'cmds'], 'listeners', 'inhibitors'], (_, str: string) => {
				const handlers = {
					commands: this.client.commandHandler,
					inhibitors: this.client.inhibitorHandler,
					listeners: this.client.listenerHandler,
				};
				name = str;
				return handlers[str as 'commands' | 'inhibitors' | 'listeners'];
			}),
			prompt: {
				start: stripIndents`which of the following would you like to reload?

				• Inhibitors
				• Commands
				• Listeners`,
				retry: 'please provide a valid type!',
			},
		};
		const loadNew = yield { match: 'flag', flag: ['-n', '--new'] };
		return { handler, name, loadNew };
	}

	public async exec(message: Message, { handler, loadNew, name }: { handler: ListenerHandler | InhibitorHandler | CommandHandler; loadNew?: boolean; name: string }) {
		if (loadNew) await handler.removeAll().loadAll();
		else await handler.reloadAll();
		return message.util!.reply(`all ${name} were reloaded.`);
	}
}