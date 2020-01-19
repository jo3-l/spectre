import SpectreEmbed from '@structures/SpectreEmbed';
import { CATEGORIES } from '@util/constants';
import Timer from '@util/timer';
import { escapedCodeblock, hastebin } from '@util/util';
import { stripIndents } from 'common-tags';
import { Command } from 'discord-akairo';
import { Message } from 'discord.js';
import fetch from 'node-fetch';
import { join } from 'path';
import { inspect } from 'util';

const CODEBLOCK_REGEX = /```(js|javascript)\n?([\S\s]*?)\n?```/;
const LINK_REGEX = /^https?:\/\/(www)?hasteb\.in\/(.+)(\..+)?$/;

export default class EvalCommand extends Command {
	public constructor() {
		super('eval', {
			aliases: ['eval', 'evaluate', 'ev'],
			category: CATEGORIES.OWNER,
			clientPermissions: ['EMBED_LINKS', 'SEND_MESSAGES'],
			description: {
				content: stripIndents`Evalutes arbitrary JavaScript code. 
					
					**Flags**
					• \`async\` - Runs code in an async scope
					• \`silent\` - Silently runs code
					• \`stack\` - If there is an error, a stack trace will be shown
					• \`insert-from\` - Insert prewritten code from a hastebin source.`,
				examples: ['message.channel.send(\'Hello there!\')'],
				usage: '<code> [...flags]',
			},
			flags: ['--async', '-a', '--silent', '-s', '--stack', '-st'],
			optionFlags: ['-f', '--insert-from'],
			ownerOnly: true,
			ratelimit: 2,
		});
	}

	public *args() {
		const hastebinLinkType = async (_: Message, code: string) => {
			const hastebinKey = LINK_REGEX.exec(code)?.[2];
			if (hastebinKey) {
				const { data } = await fetch(`https://hasteb.in/documents/${hastebinKey}`).then(res => res.json());
				return data;
			}
		};
		const codeType = async (_: Message, code?: string) => {
			if (!code) return;
			const content = await hastebinLinkType(_, code);
			if (content) return content;
			return CODEBLOCK_REGEX.exec(code)?.[2] ?? code;
		};

		const flags: any = { async: ['--async', '-a'], silent: ['--silent', '-s'], stack: ['--stack', '-st'] };
		for (const [name, flag] of Object.entries(flags)) {
			flags[name] = yield { flag, match: 'flag', unordered: true };
		}

		let code = yield {
			match: 'rest',
			prompt: { start: 'what would you like to evaluate?' },
			type: codeType,
			unordered: true,
		};

		const insert = yield {
			flag: ['--insert-from', '-f'],
			match: 'option',
			type: hastebinLinkType,
			unordered: true,
		};
		if (insert) code = `${insert}\n${code}`;
		return { code, ...flags };
	}

	public async exec(message: Message, { code, silent, async, stack }: ExecArgs) {
		if (async) code = `(async () => {\n${code}\n})()`;
		const embed = new SpectreEmbed().setAuthor('Eval', 'https://image.flaticon.com/icons/png/512/919/919832.png');
		try {
			const timer = new Timer();
			// eslint-disable-next-line
			let res = eval(code);
			const ms = timer.stop();
			res = await this._clean(res, 'Output');
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
				.setDescription(await this._clean(stack ? err.stack : err, 'Error')));
		}
	}

	private async _clean(text: any, name?: string) {
		if (text && text.constructor.name === 'Promise') text = await text;
		if (typeof text !== 'string') text = inspect(text);

		const raw = text
			.replace(new RegExp(join(__dirname, '..', '..', '..', '..', '..').replace(/\\/g, '\\\\'), 'g'), '~')
			.replace(this.client.token, '<token>');
		text = escapedCodeblock(raw, 'js');
		if ((8 + (text as string).length) > 1024) {
			try {
				text = `[${name}](${(await hastebin(raw))})`;
			} catch {
				text = '*An error occured while generating Hastebin link.*';
			}
		}
		return text;
	}
}

interface ExecArgs { code: string; silent: boolean; async: boolean; stack: boolean }