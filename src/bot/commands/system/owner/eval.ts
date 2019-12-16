import { Command } from 'discord-akairo';
import { MessageEmbed, Message } from 'discord.js';
import { join } from 'path';
import Timer from '../../../../util/Timer';
import { inspect } from 'util';
import fetch from 'node-fetch';
import * as Util from '../../../../util/Util';

const CODEBLOCK_REGEX = /```(js|javascript)\n?([\s\S]*?)\n?```/;
const LINK_REGEX = /^https?:\/\/(www)?hasteb\.in\/(.+)(\..+)?$/;

export default class EvalCommand extends Command {
	public constructor() {
		super('eval', {
			aliases: ['eval', 'evaluate', 'ev'],
			category: 'Owner',
			description: {
				content: 'Evalutes arbitrary JavaScript code. Run as async with `--async`, silent with `--silent`, or stack errors with `--stack`.',
				usage: '<code> [...flags]',
				examples: ['message.channel.send(\'Hello there!\')'],
			},
			ownerOnly: true,
			clientPermissions: ['EMBED_LINKS'],
			ratelimit: 2,
			flags: ['--async', '-a', '--silent', '-s', '--stack', '-st'],
		});
	}

	public *args() {
		const codeTypeCaster = async (_: Message, code?: string) => {
			if (!code) return;
			const hastebinKey = LINK_REGEX.exec(code)?.[2];
			if (hastebinKey) {
				const { data } = await fetch(`https://hasteb.in/documents/${hastebinKey}`).then(res => res.json());
				return data;
			}
			const content = CODEBLOCK_REGEX.exec(code)?.[2];
			return content ?? code;
		};
		const flags: any = { async: ['--async', '-a'], silent: ['--silent', '-s'], stack: ['--stack', '-st'] };
		for (const [name, flag] of Object.entries(flags)) flags[name] = yield { match: 'flag', flag, unordered: true };
		const code = yield {
			match: 'rest',
			type: codeTypeCaster,
			prompt: { start: 'what would you like to evaluate?' },
			unordered: true,
		};
		return { code, ...flags };
	}

	public async exec(message: Message, { code, silent, async, stack }: { code: string; silent: boolean; async: boolean; stack: boolean }) {
		if (async) code = `(async () => {\n${code}\n})()`;
		const embed = new MessageEmbed().setAuthor('Eval', 'https://image.flaticon.com/icons/png/512/919/919832.png');
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