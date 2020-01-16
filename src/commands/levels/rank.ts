import { Command } from 'discord-akairo';
import { Canvas } from 'canvas-constructor';
import { MessageAttachment, Message, User } from 'discord.js';
import { calculateLevel, calculateXp } from '@util/Util';
import fetch from 'node-fetch';
import { Member } from '../../models/Member';
import { format as d3format } from 'd3-format';

const format = (number: number) => number > 999 ? d3format('.3s')(number) : number;
const toPercentage = (current: number, total: number) => Math.round(current / total * 640);

enum statusColors {
	online = '#438581',
	dnd = '#F04747',
	idle = '#FAA61A',
	offline = '#747F8D',
}

enum fonts {
	lucidaSans = '24px Lucida Sans',
	centuryGothic = '50px Century Gothic',
}

export default class RankCommand extends Command {
	public constructor() {
		super('rank', {
			aliases: ['rank'],
			category: 'Levels',
			description: {
				content: 'Obtains the rank of a given member.',
				usage: '[user]',
				examples: ['@Joe', ''],
			},
			clientPermissions: ['SEND_MESSAGES', 'ATTACH_FILES'],
			args: [
				{
					'id': 'user',
					'type': 'user',
					'default': (message: Message) => message.author,
				},
			],
			channel: 'guild',
		});
	}

	public async exec(message: Message, { user }: { user: User }) {
		const repo = this.client.db.getRepository(Member);
		const members = await repo.find({
			where: { guildId: message.guild!.id },
			select: ['id', 'xp'],
			order: { xp: 'DESC' },
		});
		const rank = members.findIndex(member => member.id === user.id) + 1;
		if (!rank) return message.util!.reply(`**${user.tag}** is not ranked yet.`);
		const memberInfo = members[rank - 1];
		const userXp = memberInfo.xp;
		const current = userXp >= 100 ? userXp - calculateXp(calculateLevel(userXp)) : userXp;
		const total = calculateXp(calculateLevel(userXp) + 1);
		return message.util!.send(new MessageAttachment(await this._generate({
			current, total, rank, user,
			level: calculateLevel(userXp),
		})));
	}

	private async _generate({ background = 9, current, total, rank, level, user, color = 'ff0000' }: ImgenOptions) {
		current = current.toString();
		total = total.toString();
		rank = rank.toString();
		level = level.toString();
		color = color.toString().length === 6 ? color : color.toString().padStart(6, '0');
		const avatar = await fetch(user.displayAvatarURL({ format: 'png', size: 1024 })).then(res => res.buffer());
		const { buffer: _background } = this.client.assetHandler.fetch({ id: background, type: 'rank' });

		let correctX = 0;
		const canvas = new Canvas(934, 282).addImage(_background, 0, 0, 934, 282);
		if (background !== 9) {
			canvas
				.setColor('rgba(35, 39, 42, 0.5)')
				.addRect(0, 0, canvas.width, canvas.height)
				.setColor('rgba(0, 0, 0, 0.55)')
				.addBeveledRect(20, canvas.height - 250, canvas.width - 40, canvas.height - 65, 10);
		}

		canvas
			.addCircularImage(avatar, 141, 141, 80)
			.setColor('#000000')
			.addCircle(184, 194, 24)
			.setColor(statusColors[user.presence.status])
			.addCircle(184, 194, 20)
			.setColor(`#${color}`)
			.setTextFont(fonts.centuryGothic)
			.setTextAlign('right')
			.addText(level, 870, 100)
			.measureText(level, size => correctX = 865 - size.width)
			.setTextFont(fonts.lucidaSans)
			.addText('LEVEL', correctX, 100)
			.measureText('LEVEL', size => correctX -= size.width + 20)
			.setTextFont(fonts.centuryGothic)
			.setColor('#FFFFFF')
			.addText(`#${format(Number(rank))}`, correctX, 100)
			.measureText(`#${format(Number(rank))}`, size => correctX -= size.width + 5)
			.setTextFont(fonts.lucidaSans)
			.addText('RANK', correctX, 100)
			.setTextSize(38)
			.setTextAlign('start')
			.addResponsiveText(user.username, 260, 160, 322)
			.measureText(user.username, ({ width }: TextMetrics) => correctX = width)
			.setTextFont(fonts.lucidaSans)
			.setColor('#7F8384')
			.addText(`#${user.discriminator}`, correctX + 265, 160)
			.setTextSize(24)
			.setColor('#7F8384')
			.setTextAlign('right')
			.addText(`/ ${format(Number(total))} XP`, 850, 160)
			.measureText(`/ ${format(Number(total))} XP`, (size: TextMetrics) => correctX = 845 - size.width)
			.setColor('#FFFFFF')
			.addText(format(Number(current)).toString(), correctX, 160)
			.setColor('#484B4E')
			.beginPath()
			.arc(270, 200, 20, Math.PI * 0.5, Math.PI * 1.5)
			.fill()
			.closePath()
			.addRect(270, 180, 600, 40)
			.beginPath()
			.arc(870, 200, 20, Math.PI * 0.5, Math.PI * 1.5, true)
			.fill()
			.closePath()
			.addCircle(270, 200, 20);

		let percent = toPercentage(Number(current), Number(total));
		if (percent < 40) return canvas.toBufferAsync();
		canvas
			.setColor(`#${color}`)
			.addCircle(270, 200, 20)
			.addRect(270, 180, percent -= 40, 40)
			.addCircle(270 + percent, 200, 20);

		return canvas.toBufferAsync();
	}
}

interface ImgenOptions {
	background?: number;
	current: number | string;
	total: number | string;
	rank: number | string;
	level: number | string;
	user: User;
	color?: string;
}