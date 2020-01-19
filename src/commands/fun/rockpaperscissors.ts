import SpectreEmbed from '@structures/SpectreEmbed';
import { CATEGORIES } from '@util/constants';
import { oneLine } from 'common-tags';
import { Command } from 'discord-akairo';
import { Message, MessageReaction, User } from 'discord.js';

const rpsData: Record<Choice, { counters: string; emoji: string }> = {
	paper: {
		counters: 'rock',
		emoji: '✋🏼',
	},
	rock: {
		counters: 'scissors',
		emoji: '⛰️',
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
			category: CATEGORIES.FUN,
			clientPermissions: ['SEND_MESSAGES', 'EMBED_LINKS', 'ADD_REACTIONS', 'MANAGE_MESSAGES'],
			description: {
				content: 'Play a game of rock-paper-scissors with the bot!',
				examples: [''],
				usage: '',
			},
		});
	}

	public async exec(message: Message) {
		const msg = await message.util!.send(`${message.author}, react with your choice for rock-paper-scissors!`);
		const emojis = Object.values(rpsData).map(item => item.emoji);
		const choices = Object.keys(rpsData);
		for (const emoji of emojis) await msg.react(emoji);
		const choice = await msg.awaitReactions(
			(reaction: MessageReaction, user: User) => emojis.includes(reaction.emoji.name) && user.id === message.author.id,
			{ errors: ['time'], max: 1, time: 15e3 },
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