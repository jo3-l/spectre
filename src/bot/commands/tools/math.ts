import { Command } from 'discord-akairo';
import { MessageEmbed, Message } from 'discord.js';
import { evaluate } from 'mathjs';

export default class EvaluateCommand extends Command {
	public constructor() {
		super('calculate', {
			aliases: ['calculate', 'calc', 'math'],
			category: 'Tools',
			description: {
				content: 'Calculates a given mathematical expression.',
				usage: '<expression>',
				examples: ['1+1', '11^3', '12.7 cm to inch'],
			},
			clientPermissions: ['EMBED_LINKS', 'SEND_MESSAGES'],
			args: [{ id: 'expr', match: 'content', prompt: { start: 'what would you like to calculate?' } }],
		});
	}

	public exec(message: Message, { expr }: { expr: string }) {
		const trim = (v: any, t = 1018) => {
			v = v.toString().replace(/`/g, `\`${String.fromCharCode(8203)}`);
			return v.length > t ? `${v.slice(0, t - 3)}...` : v;
		};
		try {
			const res = evaluate(expr);
			message.util!.send(new MessageEmbed()
				.setColor('GREEN')
				.setAuthor('Calculator', 'https://cdn0.iconfinder.com/data/icons/finance-icons-rounded/110/Calculator-512.png')
				.addField('Input', `\`\`\`\n${trim(expr)}\`\`\``)
				.addField('Output', `\`\`\`\n${trim(res)}\`\`\``));
		} catch (err) {
			message.util!.send(new MessageEmbed()
				.setColor('RED')
				.setAuthor('Calculator', 'https://cdn0.iconfinder.com/data/icons/finance-icons-rounded/110/Calculator-512.png')
				.addField('Input', `\`\`\`\n${trim(expr)}\`\`\``)
				.addField('Error', `\`\`\`\n${trim(err)}\`\`\``));
		}
	}
}