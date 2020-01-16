import { Command, Argument } from 'discord-akairo';
import { Message } from 'discord.js';
import SpectreEmbed from '@structures/SpectreEmbed';
import { stripIndents } from 'common-tags';
import { ordinal } from '@util/Util';
import { CATEGORIES } from '@util/Constants';

const emojis = ['1⃣', '2⃣', '3⃣', '4⃣', '5⃣', '6⃣', '7⃣', '8⃣', '9⃣', '🔟'];

export default class PollCommand extends Command {
	public constructor() {
		super('poll', {
			aliases: ['poll'],
			category: CATEGORIES.TOOLS,
			description: {
				content: stripIndents`Creates a poll.
					**Note**: The answers all must be under 150 characters in length!`,
				usage: '<question> [...answers]',
				examples: ['"Do you like cats or dogs more?" cats dogs', 'sleep? "Yeah you should" "No you shouldn\'t"'],
			},
			clientPermissions: ['EMBED_LINKS', 'SEND_MESSAGES'],
		});
	}

	public *args() {
		const tooLong = 'the answers must be under 150 characters each. Try again.';
		const prompt = (num: number) => `what would you like the ${ordinal(num)} answer to be?`;
		const question = yield {
			type: Argument.validate('string', (_, str) => str.length < 240),
			prompt: {
				start: 'what would you like the question to be?',
				retry: 'the question must be under 250 characters. Try again.',
			},
		};
		const answers: string[] = [];
		for (let i = 0; i < 10; i++) {
			const answer = yield {
				type: Argument.validate('string', (_, str) => str.length < 150),
				prompt: i < 2 ? { start: prompt(i + 1), retry: tooLong } : { optional: true, start: tooLong, retry: tooLong },
			};
			if (answer) answers.push(answer);
			else return { question, answers };
		}
		return { question, answers };
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