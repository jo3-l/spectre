import { Command } from 'discord-akairo';
import { Message } from 'discord.js';
import SpectreEmbed from '@structures/SpectreEmbed';
import Confirmation, { Responses } from '@structures/Confirmation';

export default class ResetLogsCommand extends Command {
	public constructor() {
		super('logs-reset', {
			category: 'Settings',
		});
	}

	public async exec(message: Message) {
		const confirm = await new Confirmation(message, new SpectreEmbed()
			.setColor('YELLOW')
			.setAuthor('⚠️ This action is irreversible.')
			.setTitle('Confirmation')
			.setDescription('Are you sure you wish to reset all log settings to default? [yes/no]')
			.setFooter('You can respond with \'cancel\' to cancel the command!')).run();
		switch (confirm) {
			case Responses.Canceled:
			case Responses.No: return message.reply('the command has been cancelled.');
			case Responses.Timeout: return message.reply('you didn\'t respond in time. The command has been cancelled.');
			default:
				await message.util!.send(`${this.client.emojis.loading} Resetting log settings to default...`);
				await this.client.settings.delete(message.guild!, 'logs');
				message.util!.send(`${this.client.emojis.success} Reset all log related settings to default.`);
		}
	}
}