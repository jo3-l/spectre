import { Canvas } from 'canvas-constructor';
import { Listener } from 'discord-akairo';
import { GuildMember, MessageAttachment, TextChannel } from 'discord.js';
import fetch from 'node-fetch';

export default class LevelUpListener extends Listener {
	public constructor() {
		super('levelUp', {
			emitter: 'client',
			event: 'levelUp',
		});
	}

	public async exec(channel: TextChannel, { member, background = 1, level }: ImgenOptions) {
		level = level.toString();
		const { guild, user } = member;
		const roleData = { add: [] as string[], remove: [] as string[] };
		const roleRewards = this.client.settings.get(guild, 'roleRewards');
		const roleRewardsType = this.client.settings.get(guild, 'rewardType');

		if (roleRewards?.[level]) {
			const ids = Object.values(roleRewards);
			switch (roleRewardsType) {
				case 'highest':
					roleData.add = [roleRewards[level]];
					ids.splice(ids.indexOf(level), 1);
					roleData.remove = ids;
					break;
				default:
					roleData.add.push(...Object.entries(roleRewards)
						.filter(([key]) => Number(key) <= level)
						.map(([, id]) => id));
					break;
			}
		}

		const { buffer: _background } = this.client.assetHandler.fetch({ id: background, type: 'levelup' });
		const avatar = await fetch(user.displayAvatarURL({ format: 'png', size: 1024 })).then(res => res.buffer());

		const generatedImg = await new Canvas(210, 80)
			.addImage(_background, 0, 0, 210, 80)
			.beginPath()
			.setLineWidth(1)
			.setColor('rgba(0, 0, 0, 0.7)')
			.addRect(38.5, 8, 160, 62)
			.setColor('#FFFFFF')
			.addCircle(38.5, 38, 31)
			.addCircularImage(avatar, 38.5, 38, 30)
			.setTextFont('25px Lucida Sans')
			.addText('LEVEL UP', 75, 40)
			.setTextSize(15)
			.addText(`LEVEL ${level}`, 75, 58)
			.toBufferAsync();

		channel.send(`🎉 GG ${user}, you advanced to level ${level}!`, new MessageAttachment(generatedImg));
		if (!guild.me!.permissions.has('MANAGE_ROLES')) return;
		const toAdd = roleData.add.filter(id => guild.roles.has(id));
		const toRemove = roleData.remove.filter(id => guild.roles.has(id));
		member.roles.set(
			[...member.roles.keyArray(), ...toAdd].filter(role => !toRemove.includes(role)),
			'Spectre leveled roles settings',
		);
	}
}

interface ImgenOptions {
	member: GuildMember;
	background?: number;
	level: number | string;
}