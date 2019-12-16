import { Listener } from 'discord-akairo';
import { MessageAttachment, Message, User, Snowflake } from 'discord.js';
import { Canvas } from 'canvas-constructor';
import { join } from 'path';
import { calculateLevel } from '../../../util/Util';
import fetch from 'node-fetch';
import { Member } from '../../db/entities/Member';
import { promisify } from 'util';
import { readFile } from 'fs';

const loadImage = promisify(readFile);
const IMAGE_DIRECTORY = join(__dirname, '..', '..', '..', 'assets', 'social', 'levelup');

export default class MessageListener extends Listener {
	private readonly cooldowns: Map<Snowflake, Set<Snowflake>> = new Map();
	public constructor() {
		super('message', {
			emitter: 'client',
			event: 'message',
			category: 'Discord',
		});
	}

	public async exec(message: Message) {
		if (!message.guild || message.author.bot) return;
		const data = { guildId: message.guild.id, id: message.author.id };
		const cooldowns = this.cooldowns.get(message.guild.id) ??
			this.cooldowns.set(message.guild.id, new Set()).get(message.guild.id);
		if (!cooldowns) return;
		if (cooldowns.has(message.author.id)) return;
		const xpAmount = Math.floor(Math.random() * 10) + 15;
		const repo = this.client.db.getRepository(Member);
		let member = await repo.findOne(data);
		if (!member) member = await repo.create(data);

		const oldLevel = calculateLevel(member.xp);
		member.xp += xpAmount;
		const { xp: newXp } = await repo.save(member);
		const newLevel = calculateLevel(newXp);
		if (newLevel !== 0 && newLevel !== oldLevel) {
			message.channel.send(`GG ${message.author}, you advanced to **level ${newLevel}**!`,
				new MessageAttachment(await this.generate({ user: message.author, level: newLevel })));
		}
		cooldowns.add(message.author.id);
		setTimeout(() => cooldowns.delete(message.author.id), 60000);
	}

	private async generate({ user, background = 'Clouds', level }: IGenerateOptions) {
		const _background = await loadImage(join(IMAGE_DIRECTORY, `${background}.png`));
		const avatar = await fetch(user.displayAvatarURL({ format: 'png', size: 1024 })).then(res => res.buffer());

		return new Canvas(210, 80)
			.addImage(_background, 0, 0, 210, 80)
			.beginPath()
			.setLineWidth(1)
			.setColor('rgba(35, 39, 42, 0.7)')
			.addRect(38.5, 8, 160, 62)
			.setColor('#FFFFFF')
			.addCircle(38.5, 38, 31)
			.addCircularImage(avatar, 38.5, 38, 30)
			.setTextFont('25px Lucida Sans')
			.addText('LEVEL UP', 75, 40)
			.setTextSize(15)
			.addText(`LEVEL ${level}`, 75, 58)
			.toBufferAsync();
	}
}

interface IGenerateOptions {
	user: User;
	background?: string;
	level: number;
}