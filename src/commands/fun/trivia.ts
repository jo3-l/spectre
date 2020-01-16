import { Command } from 'discord-akairo';
import { Message } from 'discord.js';
import SpectreEmbed from '@structures/SpectreEmbed';
import { stringify } from 'querystring';
import fetch from 'node-fetch';
import { capitalize } from '@util/Util';
import { stripIndents } from 'common-tags';
import { CATEGORIES } from '@util/Constants';

export default class TriviaCommand extends Command {
	public constructor() {
		super('trivia', {
			aliases: ['trivia'],
			description: {
				content: 'Play a game of trivia!',
				usage: '',
				examples: [''],
			},
			category: CATEGORIES.FUN,
			clientPermissions: ['EMBED_LINKS', 'SEND_MESSAGES'],
		});
	}

	public async exec(message: Message) {
		const url = `https://opentdb.com/api.php?${stringify({ amount: 1, type: 'multiple', encode: 'url3986' })}`;
		const { results: [trivia] } = await fetch(url).then(res => res.json()) as ApiResponse;
		for (const [key, value] of Object.entries(trivia)) {
			trivia[key as keyof Question] = typeof value === 'string'
				? decodeURIComponent(value)
				: value.map(decodeURIComponent);
		}
		let answers = trivia.incorrect_answers;
		answers.push(trivia.correct_answer);
		answers = answers.sort();
		const possibleAnswers = answers.map((answer, i) => `**${i + 1}.** *${answer}*`).join('\n');
		const time = 25e3;

		message.util!.send(new SpectreEmbed()
			.setColor('RANDOM')
			.setAuthor(`${message.author.username}'s Trivia Question`, message.author.displayAvatarURL())
			.setDescription(stripIndents`**${trivia.question}**
				*Please choose an answer within ${time / 1000}s.*
				
				${possibleAnswers}`)
			.addField('❯ Difficulty', `\`${capitalize(trivia.difficulty)}\``, true)
			.addField('❯ Category', `\`${trivia.category}\``, true)
			.setFooter('💡 Tip: You can use either the number or the word to answer!'));

		const validAnswers = [trivia.correct_answer.toLowerCase(), (answers.indexOf(trivia.correct_answer) + 1).toString()];
		let choice: Message;
		try {
			choice = (await message.channel.awaitMessages((msg: Message) => msg.author.id === message.author.id, {
				max: 1, time, errors: ['time'],
			})).first()!;
		} catch {
			return message.channel.send(`You didn\'t answer in time. The correct answer was ${trivia.correct_answer}.`);
		}

		if (validAnswers.includes(choice.content.toLowerCase() ?? '')) {
			return message.channel.send('Good job! That was the correct answer.');
		}
		return message.channel.send(`That wasn\'t the correct response. The answer was ${trivia.correct_answer}.`);
	}
}

interface ApiResponse {
	response_code: number;
	results: [Question];
}

interface Question {
	category: string;
	type: string;
	difficulty: string;
	question: string;
	correct_answer: string;
	incorrect_answers: string[];
}