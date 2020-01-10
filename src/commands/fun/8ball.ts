import { Command } from 'discord-akairo';
import { Message } from 'discord.js';

const answers = [
	'It is certain.',
	'It is decidedly so.',
	'Without a doubt.',
	'Yes - definitely.',
	'You may rely on it.',
	'As I see it, yes.',
	'Most likely.',
	'Outlook good.',
	'Yes.',
	'Signs point to yes.',
	'Reply hazy, try again.',
	'Ask again later.',
	'Better not tell you now.',
	'Cannot predict now.',
	'Concentrate and ask again.',
	'Don\'t count on it.',
	'My reply is no.',
	'My sources say no.',
	'Outlook not so good.',
	'Very doubtful.',
];

export default class EightballCommand extends Command {
	public constructor() {
		super('8ball', {
			aliases: ['8ball', '8'],
			category: 'Fun',
			description: {
				usage: '<question>',
				content: 'Asks a question of the allmighty 8ball.',
				examples: ['Are you a real 8ball?'],
			},
			clientPermissions: ['SEND_MESSAGES'],
			args: [
				{
					id: 'question',
					prompt: { start: 'what is your question?' },
				},
			],
			ratelimit: 2,
		});
	}

	public async exec(message: Message) {
		await message.util!.send('🎱 - The 8ball is thinking...');
		setTimeout(() => {
			message.util!.send(`🎱 - ${answers[Math.floor(Math.random() * answers.length)]}`);
		}, Math.round(Math.random() * 5) * 1000);
	}
}