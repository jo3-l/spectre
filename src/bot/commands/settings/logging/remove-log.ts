import { Command, Argument, Flag } from 'discord-akairo';
import { Log } from '../../../structures/SettingsProvider';
import { Message, Snowflake } from 'discord.js';

export default class RemoveLogcommand extends Command {
	public constructor() {
		super('remove-log', {
			category: 'Settings',
			args: [
				{
					id: 'type',
					type: Argument.compose([
						['join', 'joinlogs', 'joins', 'join-log', 'join-logs'],
						['members', 'memberlog', 'member-log', 'member-logs', 'member'],
						['messages', 'msgs', 'msglog', 'message-log', 'messagelog', 'messagelogs'],
						// eslint-disable-next-line max-len
						['server', 'serverlog', 'guildlog', 'server-log', 'guild-log', 'server-logs', 'guild-logs', 'server', 'guild'],
						['voice', 'voicelog', 'voice-log', 'voicelogs', 'voice-logs'],
					], (message, phrase: unknown) => {
						const type = phrase as Log;
						const settings = this.client.settings.get(message.guild!, 'logs', {} as { [key in Log]: Snowflake });
						if (!(type in settings)) return Flag.fail('NON_EXISTENT');
						return type;
					}),
					prompt: {
						start: 'please choose a type of log to remove (join, members, messages, server, voice).',
						retry: (_: Message, { failure }: { failure: { value: string } }) => {
							// eslint-disable-next-line max-len
							if (failure.value) return 'there is no channel set for that type. Try again.';
							return 'please provide the type of log to remove from the settings.';
						},
					},
				},
			],
		});
	}

	public async exec(message: Message, { type }: { type: Log }) {
		const current = this.client.settings.get(message.guild!, 'logs');
		if (!current) return `${this.client.emojis.error} There is no channel set for that type!`;
		delete current[type];
		await this.client.settings.set(message.guild!, 'logs', current);
		message.util!.send(`${this.client.emojis.success} Successfully removed the log channel for the type \`${type}\`!`);
	}
}