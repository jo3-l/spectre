import { Command } from 'discord-akairo';
import { MessageEmbed, Message } from 'discord.js';
import { join } from 'path';
import Timer from '../../../../util/Timer';
import { inspect } from 'util';
import * as Util from '../../../../util/Util';
const CODEBLOCK_REGEX = /```([a-zA-Z]*)\n?([\s\S]*?)\n?```/;

export default class EvalCommand extends Command {
	public constructor() {
		super('eval', {
			aliases: ['eval', 'evaluate', 'e', 'ev'],
			category: 'Owner',
			description: {
				content: 'Evalutes arbitrary JavaScript code. Run as async with `--async`, silent with `--silent`, or stack errors with `--stack`.',
				usage: '<code> [...flags]',
				examples: ['message.channel.send(\'Hello there!\')'],
			},
			ownerOnly: true,
			clientPermissions: ['EMBED_LINKS'],
			ratelimit: 2,
			args: [
				{
					id: 'async',
					match: 'flag',
					flag: ['--async', '-a'],
					unordered: true,
				},
				{
					id: 'silent',
					match: 'flag',
					flag: ['--silent', '-s'],
					unordered: true,
				},
				{
					id: 'stack',
					match: 'flag',
					flag: ['--stack', '-st'],
					unordered: true,
				},
				{
					id: 'code',
					match: 'rest',
					type: (_, code) => {
						if (!code) return;
						const [match, lang = '', content] = CODEBLOCK_REGEX.exec(code) || [];
						if (match && ['js', 'javascript'].includes(lang.toLowerCase())) return content;
						return code;
					},
					prompt: {
						start: 'what would you like to evaluate?',
					},
					unordered: true,
				},
			],
		});
	}

	public async exec(message: Message, { code, silent, async, stack }: { code: string; silent?: string; async?: string; stack?: string }) {
		if (async) code = `(async () => {\n${code}\n})()`;
		const embed = new MessageEmbed().setAuthor('Eval', 'https://discordemoji.com/assets/emoji/node_js.png');
		try {
			const timer = new Timer();
			// eslint-disable-next-line
			let res = eval(code);
			const ms = timer.stop();
			res = await this.clean(res, 'Output');
			if (silent) return;

			return message.util!.send(embed
				.setColor(6398041)
				.setTitle('`Output`')
				.setDescription(res)
				.setFooter(`⏱ ${ms}ms`));
		} catch (err) {
			return message.util!.send(embed
				.setColor(this.client.config.color)
				.setTitle('`Error`')
				.setDescription(await this.clean(stack ? err.stack : err)));
		}
	}

	private async clean(text: any, name?: string) {
		if (text && text.constructor.name === 'Promise') text = await text;
		if (typeof text !== 'string') text = inspect(text, { depth: 1 });

		const raw = text
			.replace(/`/g, `\`${String.fromCharCode(8203)}`)
			.replace(new RegExp(join(__dirname, '..', '..', '..', '..', '..').replace(/\\/g, '\\\\'), 'g'), '~')
			.replace(this.client.token, 'token');
		text = `\`\`\`js\n${raw}\`\`\``;
		if ((8 + (text as string).length) > 1024) {
			try {
				text = `[${name}](${(await Util.hastebin(raw))})`;
			} catch {
				text = '*An error occured while generating Hastebin link.*';
			}
		}
		return text;
	}
}