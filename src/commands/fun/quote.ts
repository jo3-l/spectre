import { CATEGORIES } from '@util/constants';
import SpectreEmbed from '@util/SpectreEmbed';
import { Command } from 'discord-akairo';
import { Message } from 'discord.js';

const MESSAGE_LINK_REGEX = /https:\/\/(?:www\.)?(?:ptb\.|canary\.)?discordapp\.com\/channels\/\d+\/(\d+)\/(\d+)/;

export default class QuoteCommand extends Command {
	public constructor() {
		super('quote', {
			aliases: ['quote'],
			category: CATEGORIES.FUN,
			channel: 'guild',
			clientPermissions: ['EMBED_LINKS', 'SEND_MESSAGES'],
			description: {
				content: 'Quote someone!',
				examples: ['#general 123456', '123456'],
				usage: '[channel] <id>',
			},
			regex: MESSAGE_LINK_REGEX,
		});
	}

	public *args() {
		const channel = yield { type: 'textChannel' };
		let msg: any = {
			match: 'content', prompt: {
				retry: 'that wasn\'t a valid message ID!',
				start: 'please provide a valid message ID.',
			}, type: 'message',
		};
		if (channel) msg = { type: 'message' };
		msg = yield msg;
		return { msg };
	}

	public async exec(message: Message, { match, msg }: { match?: RegExpMatchArray; msg?: Message }) {
		if (!msg && match) {
			const [, channel, id] = match;
			if (!message.guild!.channels.cache.has(channel)) return;
			try { msg = await message.channel.messages.fetch(id); } catch { }
		}
		if (!msg || (!msg.content && !msg.attachments.size)) return;
		const embed = new SpectreEmbed()
			.setAuthor(msg.author.tag, msg.author.displayAvatarURL())
			.setColor(msg.member!.roles.highest ? msg.member!.roles.highest.color : this.client.config.color)
			.setFooter(`Quoted by ${message.author.tag}`)
			.setTimestamp()
			.setImage(msg.attachments.first()?.proxyURL ?? '')
			.setDescription(msg.content ?? '');
		message.util!.send(embed);
	}
}