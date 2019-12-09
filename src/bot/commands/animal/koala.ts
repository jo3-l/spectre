import { Command } from 'discord-akairo';
import fetch from 'node-fetch';
import { MessageEmbed, Message } from 'discord.js';

export default class KoalaCommand extends Command {
	private readonly url = 'https://some-random-api.ml/img/koala';
	public constructor() {
		super('koala', {
			aliases: ['koala'],
			description: {
				content: '🐨 Sends a random koala in the chat.',
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
			.setTitle('🐨 Koala')
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