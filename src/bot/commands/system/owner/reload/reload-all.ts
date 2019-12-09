import { Command } from 'discord-akairo';
import { Message } from 'discord.js';

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
			args: [
				{
					id: 'type',
					type: [['commands', 'cmds'], 'listeners', 'inhibitors'],
					prompt: {
						start: 'which one of the following would you like to reload?\n\n• Inhibitors\n• Commands\n• Listeners',
						retry: 'that wasn\'t a valid type!',
					},
				},
				{
					id: 'loadNew',
					match: 'flag',
					flag: ['-n', '--new'],
				},
			],
		});
	}

	public async exec(message: Message, { type, loadNew }: { type: 'commands' | 'listeners' | 'inhibitors'; loadNew?: boolean }) {
		const handler = ({
			commands: this.client.commandHandler,
			inhibitors: this.client.inhibitorHandler,
			listeners: this.client.listenerHandler,
		})[type];
		if (loadNew) await handler.removeAll().loadAll();
		else await handler.reloadAll();
		return message.util!.send(`All ${type} were reloaded.`);
	}
}