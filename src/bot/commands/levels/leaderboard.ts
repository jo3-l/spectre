import { Command, Argument } from 'discord-akairo';
import { Member } from '../../models/Member';
import { MessageEmbed, Message } from 'discord.js';
import { calculateLevel } from '../../../util/Util';
import { stripIndents } from 'common-tags';

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
					'type': Argument.compose('number', (_, int: unknown) => (int as number >= 1 ? int as number * 10 : null)),
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
			skip: page - 10,
			take: page,
		});
		if (!result.length) return message.util!.reply(`there are no ranked members on page ${page / 10}!`);
		const mapped = await Promise.all(result.map(async (member, i) => {
			const { id, xp } = member;
			let username = `User left guild (ID ${id})`;
			try {
				username = (await message.guild!.members.fetch(id)).user.tag;
			} catch { }
			return stripIndents`**${i + 1}.** [\`${username}\`](https://discordapp.com)
			- \`Level ${calculateLevel(xp)}\` | \`${xp} XP\``;
		}));
		return message.util!.send(new MessageEmbed()
			.setTitle(`🏆 Leaderboard`)
			.setThumbnail(this.client.config.categoryImages.levels)
			.setDescription(mapped.join('\n\n'))
			.setFooter(`Page ${page / 10} | Showing ${result.length} members`)
			.setURL('https://discordapp.com')
			.setColor(this.client.config.color));
	}
}