import { Command } from 'discord-akairo';
import { Message, TextChannel, MessageEmbed } from 'discord.js';

export default class QuoteCommand extends Command {
	public constructor() {
		super('quote', {
			aliases: ['quote'],
			category: 'Fun',
			clientPermissions: ['EMBED_LINKS'],
			regex: /https:\/\/(www\.)?(ptb\.|canary\.)?discordapp\.com\/channels\/(\d+)\/(\d+)\/(\d+)/,
			description: {
				content: 'Quote someone!',
				usage: '[channel] <id>',
				examples: ['#general 123456', '123456'],
			},
			channel: 'guild',
		});
	}

	public *args() {
		const channel: TextChannel | null = yield { type: 'textChannel' };
		let msg: any = { type: 'message', prompt: { start: 'please provide a valid message ID.', retry: 'that wasn\'t a valid message ID!' }, match: 'content' };
		if (channel) {
			msg = {
				type: async (_: Message, phrase: string) => {
					if (!/^\d+$/.test(phrase)) return;
					return channel.messages.fetch(phrase);
				},
			};
		}
		msg = yield msg;
		return { msg };
	}

	public async exec(message: Message, { match, msg }: { match: any; msg?: Message }) {
		if (!msg && match) {
			const [, , , , channel, id] = match;
			if (!message.guild!.channels.has(channel)) return;
			try {
				msg = await message.channel.messages.fetch(id);
			} catch {
				return;
			}
		}
		if (!msg || (!msg.content && !msg.attachments.size)) return;
		const embed = new MessageEmbed()
			.setAuthor(msg.author.tag, msg.author.displayAvatarURL())
			.setColor(msg.member!.roles.highest ? msg.member!.roles.highest.color : this.client.config.color)
			.setFooter(`Quoted by ${message.author.tag}`)
			.setTimestamp()
			.setImage(msg.attachments.first()?.proxyURL ?? '')
			.setDescription(msg.content ?? '');
		message.util!.send(embed);
	}
}