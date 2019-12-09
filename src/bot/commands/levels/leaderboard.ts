import { Command, Argument } from 'discord-akairo';
import { Member } from '../../db/entities/Member';
import { MessageEmbed, Message } from 'discord.js';
import { calculateLevel } from '../../../util/Util';

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
					'type': Argument.range('integer', 0, Infinity),
					'default': 1,
				},
			],
			channel: 'guild',
		});
	}

	public async exec(message: Message, { page }: { page: number }) {
		page *= 10;
		const repo = this.client.db.getRepository(Member);
		const result = (await repo.find({
			where: { guildId: message.guild!.id },
			select: ['id', 'xp'],
			order: { xp: 'DESC' },
			take: page,
		})).slice((page - 10), page);
		if (!result.length) return message.util!.reply(`there are no ranked members on page ${page / 10}!`);
		const mapped = await Promise.all(result
			.map(async (member, i) => {
				const { id, xp } = member;
				return `• **${i + 1}.** [${(await this.client.users.fetch(id)).tag}](https://discordapp.com) :: Level ${calculateLevel(xp)} (${xp} XP)`;
			}));
		return message.util!.send(new MessageEmbed()
			.setAuthor(`${message.guild!.name}'s Leaderboard`)
			.setThumbnail(message.guild!.iconURL() ?? '')
			.setDescription(mapped.join('\n'))
			.setFooter(`Page ${page / 10}`)
			.setColor(this.client.config.color));
	}
}