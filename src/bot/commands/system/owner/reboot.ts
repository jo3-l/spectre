import { Command, Argument } from 'discord-akairo';
import { Message } from 'discord.js';

export default class RebootCommand extends Command {
	public constructor() {
		super('reboot', {
			aliases: ['reboot', 'die'],
			category: 'Owner',
			description: {
				content: 'Reboots the bot.',
				usage: '',
				examples: [''],
			},
			ownerOnly: true,
			clientPermissions: ['SEND_MESSAGES'],
			ratelimit: 2,
		});
	}

	public async exec(message: Message) {
		const confirmArg = new Argument(this, {
			id: 'confirm',
			type: [['yes', 'yup', 'y'], ['no', 'nope', 'n']],
			prompt: {
				start: 'please confirm that you wish to reload the bot (y/n).',
			},
		});
		let confirm: string;
		try {
			confirm = await confirmArg.collect(message);
		} catch {
			return message.util!.send('Canceled.');
		}
		if (!confirm) return message.util!.send('Canceled.');
		if (confirm.startsWith('y')) {
			await message.channel.send('Rebooting...');
			await this.client.destroy();
			await process.exit();
		}
	}
}