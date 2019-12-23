import { Command, Argument } from 'discord-akairo';
import { Member } from '../../models/Member';
import { MessageEmbed, Message } from 'discord.js';
import { calculateLevel } from '../../../util/Util';
import { oneLineTrim } from 'common-tags';

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
			clientPermissions: 'EMBED_LINKS',
			ratelimit: 1,
			args: [
				{
					'id': 'page',
					/** @todo Find a more elegant solution to this */
					'type': Argument.compose('number', (_, int: unknown) => (int as number >= 1 ? int as number * 10 : null)),
					'default': 10,
				},
			],
			channel: 'guild',
		});
	}

	public async exec(message: Message, { page }: { page: number }) {
		await message.util!.send(`${this.client.emojis.loading} Generating leaderboard...`);
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
			return oneLineTrim`• **${i + 1}.** [${(await this.client.users.fetch(id)).tag}](https://discordapp.com)
				:: Level ${calculateLevel(xp)} (${xp} XP)`;
		}));
		return message.util!.send(new MessageEmbed()
			.setAuthor(`${message.guild!.name}'s Leaderboard`)
			.setThumbnail(message.guild!.iconURL() ?? '')
			.setDescription(mapped.join('\n'))
			.setFooter(`Page ${page / 10}`)
			.setColor(this.client.config.color));
	}
}