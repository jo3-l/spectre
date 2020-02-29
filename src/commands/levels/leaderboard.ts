import { Member } from '@schemas/Member';
import RichDisplay from '@structures/RichDisplay';
import { CATEGORIES, CATEGORY_IMAGES } from '@util/constants';
import paginate from '@util/paginate';
import SpectreEmbed from '@util/SpectreEmbed';
import { calculateLevel } from '@util/util';
import { Argument, Command } from 'discord-akairo';
import { Message, TextChannel } from 'discord.js';

export default class LeaderboardCommand extends Command {
	public constructor() {
		super('leaderboard', {
			aliases: ['leaderboard', 'lb', 'top'],
			args: [
				{
					'default': 10,
					'id': 'page',
					'type': Argument.compose(
						Argument.range('number', 0, Infinity),
						(_, x: unknown) => x as number * 10,
					),
				},
			],
			category: CATEGORIES.LEVELS,
			channel: 'guild',
			clientPermissions: ['EMBED_LINKS', 'SEND_MESSAGES'],
			description: {
				content: 'Shows the XP leaderboard for this server.',
				examples: ['1', ''],
				usage: '[page]',
			},
		});
	}

	public async exec(message: Message, { page }: { page: number }) {
		const repo = this.client.db.getRepository(Member);
		const result = await repo.find({
			order: { xp: 'DESC' },
			select: ['id', 'xp'],
			where: { guildId: message.guild!.id },
			...this._getRange(page),
		});
		if (!result.length) return message.util!.reply(`there are no ranked members on page ${page / 10}!`);
		const pages = paginate(await Promise.all(
			result.map(this._formatEntry.bind(this)),
		), 10);

		new RichDisplay({
			channel: message.channel as TextChannel,
			filter: (_, user) => message.author.id === user.id,
			pages: pages.map(page => new SpectreEmbed().setDescription(page.join('\n\n'))),
		})
			.transformAll((page, i, total) => page
				.setFooter(`Page ${i + 1} / ${total} | Showing 10 members per page`)
				.setURL('https://discordapp.com')
				.setThumbnail(CATEGORY_IMAGES[CATEGORIES.LEVELS])
				.setTitle('🏆 Leaderboard'))
			.set('start', page / 10)
			.build();
	}

	private async _formatEntry({ id, xp }: Member, index: number) {
		const username = await this.client.users.fetch(id)
			.then(user => user.tag)
			.catch(() => `Unknown user (ID ${id})`);
		return `**${index + 1}.** [\`${username}\`](https://discordapp.com) \n- \`Level ${calculateLevel(xp)}\` | \`${xp} XP\``;
	}

	private _getRange(page: number, totalEntries = 1000) {
		const skip = page - 10 - totalEntries > 0 ? page - totalEntries - 10 : 0;
		const take = totalEntries - skip;
		return { skip, take };
	}
}