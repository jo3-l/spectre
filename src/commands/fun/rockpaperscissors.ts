import { Command } from 'discord-akairo';
import { Message, User, MessageReaction } from 'discord.js';
import SpectreEmbed from '@structures/SpectreEmbed';
import { oneLine } from 'common-tags';
import { CATEGORIES } from '@util/constants';

const rpsData: Record<Choice, { counters: string; emoji: string }> = {
	rock: {
		counters: 'scissors',
		emoji: '⛰️',
	},
	paper: {
		counters: 'rock',
		emoji: '✋🏼',
	},
	scissors: {
		counters: 'paper',
		emoji: '✂️',
	},
};

export default class RockPaperScissorsCommand extends Command {
	public constructor() {
		super('rock-paper-scissors', {
			aliases: ['rock-paper-scissors', 'rps'],
			description: {
				content: 'Play a game of rock-paper-scissors with the bot!',
				usage: '',
				examples: [''],
			},
			category: CATEGORIES.FUN,
			clientPermissions: ['SEND_MESSAGES', 'EMBED_LINKS', 'ADD_REACTIONS', 'MANAGE_MESSAGES'],
		});
	}

	public async exec(message: Message) {
		const msg = await message.util!.send(`${message.author}, react with your choice for rock-paper-scissors!`);
		const emojis = Object.values(rpsData).map(item => item.emoji);
		const choices = Object.keys(rpsData);
		for (const emoji of emojis) await msg.react(emoji);
		const choice = await msg.awaitReactions(
			(reaction: MessageReaction, user: User) => emojis.includes(reaction.emoji.name) && user.id === message.author.id,
			{ time: 15e3, errors: ['time'], max: 1 },
		).then(reactions => choices[emojis.indexOf(reactions.first()!.emoji.name)] as Choice)
			.catch(() => undefined);
		await msg.delete();
		if (!choice) return message.util!.send(`${message.author}, you didn't react in time!`);
		const selfChoice = choices[Math.floor(Math.random() * choices.length)] as Choice;
		const winner = choice === selfChoice
			? null
			: rpsData[choice].counters === selfChoice ? message.author : this.client.user!;
		const embed = new SpectreEmbed()
			.setTitle(`${winner ? `${winner.username} won!` : 'It\'s a tie!'}`)
			.setDescription(oneLine`**${this.client.user!.username}** chose ${rpsData[selfChoice].emoji}, 
				while **${message.author.username}** chose ${rpsData[choice].emoji}.`)
			.setTimestamp();
		message.channel.send(embed);
	}
}

type Choice = 'rock' | 'paper' | 'scissors';