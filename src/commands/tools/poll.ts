import { Command } from 'discord-akairo';
import { MessageEmbed, Message } from 'discord.js';
import { stripIndents } from 'common-tags';
const EMOJIS = ['1⃣', '2⃣', '3⃣', '4⃣', '5⃣', '6⃣', '7⃣', '8⃣', '9⃣', '🔟'];

export default class PollCommand extends Command {
	public constructor() {
		super('poll', {
			aliases: ['poll'],
			category: 'Tools',
			description: {
				content: stripIndents`Creates a quick poll. You will be prompted for the answers individually.
					**Note**: The question and the answers must be under 150 characters in length each!
					
					*You may also use the -s flag to mark the poll as simple with only a question and yes/no answers only.*`,
				usage: '<question> [...answers]',
				examples: ['\'Do you like cats or dogs more?\'', 'sleep?'],
			},
			clientPermissions: ['EMBED_LINKS', 'SEND_MESSAGES'],
			args: [
				{
					id: 'question',
					match: 'content',
					prompt: { start: 'What question would you like to ask?' },
				},
				{
					id: 'answers',
					match: 'none',
					prompt: {
						start: stripIndents`What answers should be possible for the poll?
						Type them in separate messages and type \`stop\` when finished.`,
						infinite: true,
					},
				},
			],
		});
	}

	public async exec(message: Message, { question, answers }: { question: string; answers: string[] }) {
		answers = answers.slice(0, 10);
		message.channel.bulkDelete(message.util!.messages!);
		const trim = (str: string, t = 150) => str.length > t ? `${str.slice(0, t - 3)}...` : str;
		const front = answers.reduce((res, cur, index) => res += `\n${EMOJIS[index]} ${trim(cur)}`);
		const embed = new MessageEmbed()
			.setAuthor(message.author.username, message.author.displayAvatarURL())
			.setColor(this.client.config.color)
			.setTitle(`Poll: ${trim(question, 240)}`)
			.setDescription(`${EMOJIS[0]} ${front}`);
		const msg = await message.util!.send(embed);
		for (const EMOJI of EMOJIS.slice(0, answers.length)) await msg.react(EMOJI);
	}
}