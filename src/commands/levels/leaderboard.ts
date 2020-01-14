import { Command, Argument } from 'discord-akairo';
import { Member } from '../../models/Member';
import { Message, TextChannel } from 'discord.js';
import SpectreEmbed from '@structures/SpectreEmbed';
import { calculateLevel } from '@util/Util';
import RichDisplay from '@structures/RichDisplay';
import paginate from '@util/paginate';

export default class LeaderboardCommand extends Command {
	public constructor() {
		super('leaderboard', {
			category: 'Levels',
			aliases: ['leaderboard', 'lb', 'top'],
			description: {
				content: 'Shows the XP leaderboard for this server.',
				usage: '[page]',
				examples: ['1', ''],
			},
			clientPermissions: ['EMBED_LINKS', 'SEND_MESSAGES'],
			ratelimit: 1,
			args: [
				{
					'id': 'page',
					'type': Argument.compose(
						Argument.range('number', 0, Infinity),
						(_, x: unknown) => x as number * 10,
					),
					'default': 10,
				},
			],
			channel: 'guild',
		});
	}

	public async exec(message: Message, { page }: { page: number }) {
		const repo = this.client.db.getRepository(Member);
		const result = await repo.find({
			where: { guildId: message.guild!.id },
			select: ['id', 'xp'],
			order: { xp: 'DESC' },
			...this._getRange(page),
		});
		if (!result.length) return message.util!.reply(`there are no ranked members on page ${page / 10}!`);
		const pages = paginate(await Promise.all(
			result.map(this._formatEntry.bind(this)),
		), 10);

		new RichDisplay({
			filter: (_, user) => message.author.id === user.id,
			channel: message.channel as TextChannel,
			pages: pages.map(page => new SpectreEmbed().setDescription(page.join('\n\n'))),
		})
			.transformAll((page, i, total) => page
				.setFooter(`Page ${i + 1} / ${total} | Showing 10 members per page`)
				.setURL('https://discordapp.com')
				.setThumbnail(this.client.config.categoryImages.levels)
				.setTitle('🏆 Leaderboard'))
			.setStart(page / 10)
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