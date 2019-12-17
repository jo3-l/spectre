import { Command } from 'discord-akairo';
import fetch from 'node-fetch';
import { MessageEmbed, Message } from 'discord.js';

export default class CatCommand extends Command {
	private readonly url = 'https://some-random-api.ml/img/cat';
	public constructor() {
		super('cat', {
			aliases: ['cat', 'kitty'],
			description: {
				content: '🐱 Sends a random cat in the chat.',
				usage: '',
				examples: [''],
			},
			category: 'Animals',
			clientPermissions: ['EMBED_LINKS', 'SEND_MESSAGES'],
			ratelimit: 2,
		});
	}

	public async exec(message: Message) {
		const { link } = await fetch(this.url).then(res => res.json()) as ApiResponse;
		const embed = new MessageEmbed()
			.setTitle('🐱 Meowww')
			.setImage(link)
			.setColor(this.client.config.color)
			.setURL(link)
			.setFooter('Powered by some-random-api.ml')
			.setTimestamp();
		return message.util!.send(embed);
	}
}

interface ApiResponse {
	link: string;
}