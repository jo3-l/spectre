import { CATEGORIES } from '@util/constants';
import SpectreEmbed from '@util/SpectreEmbed';
import { ordinal } from '@util/util';
import { stripIndents } from 'common-tags';
import { Argument, Command } from 'discord-akairo';
import { Message } from 'discord.js';

const emojis = ['1⃣', '2⃣', '3⃣', '4⃣', '5⃣', '6⃣', '7⃣', '8⃣', '9⃣', '🔟'];

export default class PollCommand extends Command {
	public constructor() {
		super('poll', {
			aliases: ['poll'],
			category: CATEGORIES.TOOLS,
			clientPermissions: ['EMBED_LINKS', 'SEND_MESSAGES'],
			description: {
				content: stripIndents`Creates a poll.
					**Note**: The answers all must be under 150 characters in length!`,
				examples: ['"Do you like cats or dogs more?" cats dogs', 'sleep? "Yeah you should" "No you shouldn\'t"'],
				usage: '<question> [...answers]',
			},
		});
	}

	public *args() {
		const tooLong = 'the answers must be under 150 characters each. Try again.';
		const prompt = (num: number) => `what would you like the ${ordinal(num)} answer to be?`;
		const question = yield {
			prompt: {
				retry: 'the question must be under 250 characters. Try again.',
				start: 'what would you like the question to be?',
			},
			type: Argument.validate('string', (_, str) => str.length < 240),
		};
		const answers: string[] = [];
		for (let i = 0; i < 10; i++) {
			const answer = yield {
				prompt: i < 2 ? { retry: tooLong, start: prompt(i + 1) } : { optional: true, retry: tooLong, start: tooLong },
				type: Argument.validate('string', (_, str) => str.length < 150),
			};
			if (answer) answers.push(answer);
			else return { answers, question };
		}
		return { answers, question };
	}

	public async exec(message: Message, { question, answers }: { question: string; answers: string[] }) {
		message.channel.bulkDelete(message.util!.messages!);
		const possibleAnswers = answers.map((answer, i) => `${emojis[i]} ${answer}`).join('\n');
		const embed = new SpectreEmbed()
			.setAuthor(message.author.tag, message.author.displayAvatarURL())
			.setTitle(`❯ Poll: ${question}`)
			.setDescription(possibleAnswers);
		const msg = await message.util!.send(embed);
		for (const EMOJI of emojis.slice(0, answers.length)) await msg.react(EMOJI);
	}
}