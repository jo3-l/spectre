import SpectreEmbed from '@structures/SpectreEmbed';
import { CATEGORIES } from '@util/constants';
import { codeblock } from '@util/util';
import { Command } from 'discord-akairo';
import { Message } from 'discord.js';
import { evaluate } from 'mathjs';

export default class EvaluateCommand extends Command {
	public constructor() {
		super('calculate', {
			aliases: ['calculate', 'calc', 'math'],
			args: [{ id: 'expr', match: 'content', prompt: { start: 'what would you like to calculate?' } }],
			category: CATEGORIES.TOOLS,
			clientPermissions: ['EMBED_LINKS', 'SEND_MESSAGES'],
			description: {
				content: 'Calculates a given mathematical expression.',
				examples: ['1+1', '11^3', '12.7 cm to inch'],
				usage: '<expression>',
			},
		});
	}

	public exec(message: Message, { expr }: { expr: string }) {
		const trim = (v: any, t = 1950) => {
			v = v.toString().replace(/`/g, `\`${String.fromCharCode(8203)}`);
			return v.length > t ? `${v.slice(0, t - 3)}...` : v;
		};
		try {
			const res = evaluate(expr);
			message.util!.send(new SpectreEmbed()
				.setColor('GREEN')
				.setAuthor('Calculator', 'https://cdn0.iconfinder.com/data/icons/finance-icons-rounded/110/Calculator-512.png')
				.setTitle('`Output`')
				.setDescription(codeblock(trim(res))));
		} catch (err) {
			message.util!.send(new SpectreEmbed()
				.setColor('RED')
				.setAuthor('Calculator', 'https://cdn0.iconfinder.com/data/icons/finance-icons-rounded/110/Calculator-512.png')
				.setTitle('`Error`')
				.setDescription(codeblock(trim(err))));
		}
	}
}