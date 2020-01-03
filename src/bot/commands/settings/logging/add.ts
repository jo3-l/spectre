import { Command, Argument, Flag } from 'discord-akairo';
import { requiredPermissions } from '../../../structures/Log';
import { Log } from '../../../structures/SettingsProvider';
import { Message, TextChannel, Snowflake } from 'discord.js';

export default class AddLogCommand extends Command {
	public constructor() {
		super('logs-add', {
			category: 'Settings',
			args: [
				{
					id: 'type',
					type: [
						['join', 'joinlogs', 'joins', 'join-log', 'join-logs'],
						['members', 'memberlog', 'member-log', 'member-logs', 'member'],
						['messages', 'msgs', 'msglog', 'message-log', 'messagelog', 'messagelogs'],
						// eslint-disable-next-line max-len
						['server', 'serverlog', 'guildlog', 'server-log', 'guild-log', 'server-logs', 'guild-logs', 'server', 'guild'],
						['voice', 'voicelog', 'voice-log', 'voicelogs', 'voice-logs'],
					],
					prompt: {
						start: 'please choose a type of log to add (join, members, messages, server, voice).',
						retry: 'that was not a valid type of log. Please try again.',
					},
				}, {
					id: 'channel',
					type: Argument.union('textChannel', (message, phrase: unknown) => {
						const channel = phrase as TextChannel;
						if (!(
							channel.permissionsFor(message.guild!.me!)?.has(requiredPermissions)) ??
							message.guild!.me!.permissions.has(requiredPermissions)
						) return Flag.fail('NO_PERMS');
						return channel;
					}),
					prompt: {
						start: 'please provide a channel to add this log to.',
						retry: (_: Message, { failure }: { failure: { value: string } }) => {
							// eslint-disable-next-line max-len
							if (failure.value) return 'sorry, I don\'t have sufficient permissions to use that channel for logs. Try again.';
							return 'please provide a valid channel to add the log to.';
						},
					},
				},
			],
		});
	}

	public async exec(message: Message, { type, channel }: { type: Log; channel: TextChannel }) {
		const current = this.client.settings.get(message.guild!, 'logs', {} as { [key in Log]: Snowflake });
		current[type] = channel.id;
		await this.client.settings.set(message.guild!, 'logs', current);
		// eslint-disable-next-line max-len
		return message.util!.send(`${this.client.emojis.success} Successfully set ${channel} as the log channel for the type \`${type}\`.`);
	}
}