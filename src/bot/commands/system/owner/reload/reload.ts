import { Command, Argument, Category, Listener, Inhibitor } from 'discord-akairo';
import { Message } from 'discord.js';

export default class ReloadCommand extends Command {
	public constructor() {
		super('reload', {
			aliases: ['reload', 'r'],
			category: 'Owner',
			description: {
				content: 'Reloads a specific command, inhibitor, listener, or module.',
				usage: '<command|inhibitor|listener|module>',
				examples: ['Owner', 'invite'],
			},
			ownerOnly: true,
			clientPermissions: ['SEND_MESSAGES'],
			ratelimit: 2,
			args: [
				{
					id: 'module',
					type: Argument.union('commandAlias', 'command', 'inhibitor', 'listener', (_, phrase) => this.client.commandHandler.findCategory(phrase)),
					prompt: {
						start: 'which command/inhibitor/listener/module should be reloaded?',
						retry: 'that wasn\'t a valid command/inhibitor/listener/module!',
					},
				},
			],
		});
	}

	public async exec(message: Message, { module }: { module: Module | Category<string, Module> }) {
		if (module instanceof Category) {
			module.reloadAll();
			return message.util!.send(`${this.client.emojis.success} Successfully reloaded all modules in category \`${module}\`!`);
		}
		module.reload();
		return message.util!.send(`${this.client.emojis.success} Successfully reloaded the module \`${module}\`!`);
	}
}

type Module = Command | Inhibitor | Listener;