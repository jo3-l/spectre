import { Command, Argument } from 'discord-akairo';
import { promisify, inspect } from 'util';
import { exec as _exec } from 'child_process';
import { MessageEmbed, Message } from 'discord.js';
import * as Util from '../../../../util/Util';
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
						/** @todo Find a more elegant implementation for this */
						if (typeof int !== 'number') return;
						return int >= 1 && int <= 60 ? int * 1000 : null;
					}),
					'flag': ['-t', '--timeout'],
					'unordered': true,
					'default': 5,
				},
				{
					id: 'expr',
					prompt: {
						start: 'What would you like to execute?',
					},
					match: 'rest',
					unordered: true,
				},
			],
		});
	}

	public async exec(message: Message, { expr, timeout }: { expr: string; timeout: number }) {
		timeout *= 1000;
		const timer = new Timer();
		const result = await exec(expr, { timeout })
			.catch(error => ({ stdout: null, stderr: error.stderr }));
		const { stdout, stderr } = result;
		const ms = timer.stop();
		if (!stdout && !stderr) return message.util!.send(`⏱ ${ms}ms\n\nThere was no output.`);
		message.util!.send(new MessageEmbed()
			.setAuthor('Exec', 'https://cdn4.iconfinder.com/data/icons/small-n-flat/24/terminal-512.png')
			.addField('Output', stdout ? await this.clean(stdout, 'Output') : 'n/a')
			.addField('Error', stderr ? await this.clean(stderr, 'Error') : 'n/a')
			.setColor(stderr ? this.client.config.color : 6398041)
			.setFooter(`⏱ ${ms}ms`));
	}

	public async clean(text: any, name?: string) {
		if (typeof text !== 'string') text = inspect(text, { depth: 1 });
		const raw = text.replace(/`/g, `\`${String.fromCharCode(8203)}`);
		text = `\`\`\`prolog\n${raw}\`\`\``;
		if ((8 + (text as string).length) > 1024) {
			try {
				text = `[${name}](${(await Util.hastebin(raw, { extension: 'prolog' }))})`;
			} catch {
				text = '*An error occured while generating Hastebin link.*';
			}
		}
		return text;
	}
}