import { Command, Argument } from 'discord-akairo';
import { promisify, inspect } from 'util';
import { exec as _exec } from 'child_process';
import { MessageEmbed, Message } from 'discord.js';
import { hastebin, escapedCodeblock } from '../../../../util/Util';
import Timer from '../../../../util/Timer';
const exec = promisify(_exec);

export default class ExecCommand extends Command {
	public constructor() {
		super('exec', {
			aliases: ['exec'],
			category: 'Owner',
			description: {
				content: 'Executes an expression in the terminal. Set a timeout with `--timeout` (in seconds, max 60).',
				usage: '<expression> [flags]',
				examples: ['git push', 'git add . --timeout 5'],
			},
			ownerOnly: true,
			clientPermissions: ['EMBED_LINKS', 'SEND_MESSAGES'],
			args: [
				{
					'id': 'timeout',
					'match': 'option',
					'type': Argument.compose('number', (_, int: unknown) => {
						if (typeof int !== 'number') return;
						return int >= 1 && int <= 60 ? int * 1000 : null;
					}),
					'flag': ['-t', '--timeout'],
					'unordered': true,
					'default': 5000,
				},
				{
					id: 'expr',
					prompt: {
						start: 'what would you like to execute?',
					},
					match: 'rest',
					unordered: true,
				},
			],
		});
	}

	public async exec(message: Message, { expr, timeout }: { expr: string; timeout: number }) {
		await message.util!.send(`${this.client.emojis.loading} Waiting for response...`);
		const timer = new Timer();
		const result = await exec(expr, { timeout })
			.catch(error => ({ stdout: null, stderr: error.stderr }));
		const { stdout, stderr } = result;
		const ms = timer.stop();
		if (!stdout && !stderr) return message.util!.send(`⏱ ${ms}ms\n\nThere was no output.`);
		const embed = new MessageEmbed()
			.setAuthor('Exec', 'https://cdn4.iconfinder.com/data/icons/small-n-flat/24/terminal-512.png')
			.setDescription('')
			.setColor(stderr ? this.client.config.color : 6398041)
			.setFooter(`⏱ ${ms}ms`);
		if (stdout) embed.description += `**OUTPUT**\n${await this.clean(stdout)}`;
		if (stderr) embed.description += `**ERROR**\n${await this.clean(stderr)}`;
		message.util!.send(embed);
	}

	public async clean(text: any, name?: string) {
		if (typeof text !== 'string') text = inspect(text, { depth: 1 });
		const raw = text;
		text = escapedCodeblock(text, 'prolog');
		if ((8 + (text as string).length) > 900) {
			try {
				text = `[${name}](${(await hastebin(raw, { extension: 'prolog' }))})`;
			} catch {
				text = '*An error occured while generating Hastebin link.*';
			}
		}
		return text;
	}
}