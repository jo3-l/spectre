import RichDisplay from '@structures/RichDisplay';
import { CATEGORIES } from '@util/constants';
import SpectreEmbed from '@util/SpectreEmbed';
import { capitalize } from '@util/util';
import { Argument, Command } from 'discord-akairo';
import { Message, TextChannel } from 'discord.js';

export default class BackgroundsCommand extends Command {
	public constructor() {
		super('backgrounds', {
			aliases: ['backgrounds', 'bgs', 'view-bgs', 'view-backgrounds', 'banners', 'wallpapers'],
			category: CATEGORIES.LEVELS,
			channel: 'guild',
			clientPermissions: ['EMBED_LINKS', 'SEND_MESSAGES'],
			description: {
				content: 'Shows the backgrounds avaliable for levelup / rank cards. See a specific one by specifying a number.',
				examples: ['levelup 1', 'rank'],
				usage: '<levelup|rank> [page]',
			},
		});
	}

	public *args() {
		const type = yield {
			prompt: {
				retry: 'that was not a valid type of background.',
				start: 'please provide a valid type of background to show (levelup or rank).',
			},
			type: [
				['levelup', 'level-up'],
				'rank',
			],
		};
		const imageNumType = Argument.range(
			'integer',
			0,
			this.client.assetHandler.filter(img => img.type === type).size,
			true,
		);
		const number = yield {
			id: 'number',
			prompt: {
				optional: true,
				retry: 'that wasn\'t a valid number. Try again.',
				start: 'please provide a number to show.',
			},
			type: imageNumType,
		};
		return { number, type };
	}

	public async exec(message: Message, { type, number }: { type: 'levelup' | 'rank'; number?: number }) {
		const display = new RichDisplay({
			channel: message.channel as TextChannel,
			filter: (_, user) => user.id === message.author.id,
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
			.set('start', number ?? 1)
			.build();
	}
}