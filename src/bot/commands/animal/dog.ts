import { Command } from 'discord-akairo';
import fetch from 'node-fetch';
import { MessageEmbed, Message } from 'discord.js';

export default class DogCommand extends Command {
	private readonly url = 'https://some-random-api.ml/img/dog';
	public constructor() {
		super('dog', {
			aliases: ['dog', 'puppy'],
			description: {
				content: '🐶 Sends a random dog in the chat.',
				usage: '',
				examples: [''],
			},
			category: 'Animals',
			clientPermissions: ['EMBED_LINKS', 'SEND_MESSAGES'],
			ratelimit: 2,
		});
	}

	public async exec(message: Message) {
		const { link } = await fetch(this.url).then(res => res.json()) as IApiResponse;
		const embed = new MessageEmbed()
			.setTitle('🐶 Woof, woof')
			.setImage(link)
			.setColor(this.client.config.color)
			.setURL(link)
			.setFooter('Powered by some-random-api.ml')
			.setTimestamp();
		return message.util!.send(embed);
	}
}

interface IApiResponse {
	link: string;
}