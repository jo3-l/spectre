import { Listener } from 'discord-akairo';
import { Message, Snowflake } from 'discord.js';
import { calculateLevel } from '../../../util/Util';
import { Member } from '../../models/Member';

export default class MessageListener extends Listener {
	private readonly cooldowns: Map<Snowflake, Set<Snowflake>> = new Map();
	public constructor() {
		super('message', {
			emitter: 'client',
			event: 'message',
			category: 'Levels',
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
		if (!member) {
			await repo
				.createQueryBuilder()
				.insert()
				.into(Member)
				.values(data)
				.execute();
			member = { ...data, xp: 0 };
		}

		const oldLevel = calculateLevel(member.xp);
		const newXp = member.xp + xpAmount;
		await repo
			.createQueryBuilder()
			.update()
			.set({ xp: newXp })
			.where(data)
			.execute();
		const newLevel = calculateLevel(newXp);
		if (newLevel !== 0 && newLevel !== oldLevel && message.guild.me!.permissions.has(['SEND_MESSAGES', 'ATTACH_FILES'])) {
			this.client.emit('levelUp', message.channel, { member: message.member, level: newLevel });
		}
		cooldowns.add(message.author.id);
		setTimeout(() => cooldowns.delete(message.author.id), 60000);
	}
}