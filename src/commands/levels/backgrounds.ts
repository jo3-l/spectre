import { Command, Argument } from 'discord-akairo';
import RichDisplay from '@structures/RichDisplay';
import { Message, TextChannel } from 'discord.js';
import SpectreEmbed from '@structures/SpectreEmbed';
import { capitalize } from '@util/Util';

export default class BackgroundsCommand extends Command {
	public constructor() {
		super('backgrounds', {
			category: 'Levels',
			aliases: ['backgrounds', 'bgs', 'view-bgs', 'view-backgrounds', 'banners', 'wallpapers'],
			description: {
				content: 'Shows the backgrounds avaliable for levelup / rank cards. See a specific one by specifying a number.',
				usage: '<levelup|rank> [page]',
				examples: ['levelup 1', 'rank'],
			},
			clientPermissions: ['EMBED_LINKS', 'SEND_MESSAGES'],
			ratelimit: 1,
			channel: 'guild',
		});
	}

	public *args() {
		const type = yield {
			type: [
				['levelup', 'level-up'],
				'rank',
			],
			prompt: {
				start: 'please provide a valid type of background to show (levelup or rank).',
				retry: 'that was not a valid type of background.',
			},
		};
		const relevantTypeCastor = Argument.range(
			'integer', 0, this.client.assetHandler.filter(img => img.type === type).size, true,
		);
		const number = yield {
			id: 'number',
			type: relevantTypeCastor,
			prompt: {
				start: 'please provide a number to show.',
				retry: 'that wasn\'t a valid number. Try again.',
				optional: true,
			},
		};
		return { type, number };
	}

	public async exec(message: Message, { type, number }: { type: 'levelup' | 'rank'; number?: number }) {
		const display = new RichDisplay({
			filter: (_, user) => user.id === message.author.id,
			channel: message.channel as TextChannel,
		});

		const images = this.client.assetHandler
			.filter(img => img.type === type)
			.sort((a, b) => a.id - b.id);
		for (const image of images.values()) {
			display.add(new SpectreEmbed()
				.setTitle(`#${image.id}`)
				.setAuthor(`Spectre ${capitalize(type)} Backgrounds`)
				.setImage(image.url)
				.setTimestamp());
		}
		display
			.transformAll((page, index, length) => page.setFooter(`Background ${index + 1} of ${length} total`))
			.setStart(number ?? 1)
			.build();
	}
}