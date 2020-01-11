import Log, { emojis } from '@structures/Log';
import { Listener } from 'discord-akairo';
import { Guild } from 'discord.js';
import ms from 'ms';
import { humanizedRegions, verificationLevels } from '../../../commands/tools/info/serverinfo';
import SpectreEmbed from '@structures/SpectreEmbed';

export default class GuildUpdateListener extends Listener {
	public constructor() {
		super('guildUpdate', {
			event: 'guildUpdate',
			emitter: 'client',
			category: 'Logs',
		});
	}

	public async exec(oldGuild: Guild, newGuild: Guild) {
		const channel = await Log.fetchChannel(newGuild, 'server');
		if (!channel) return;
		let executor = await Log.getExecutor({ guild: newGuild, id: newGuild.id }, 'GUILD_UPDATE');
		let before: string;
		let after: string;
		let change: string;
		if (oldGuild.name !== newGuild.name) {
			before = oldGuild.name;
			after = newGuild.name;
			change = 'name';
		} else if (oldGuild.afkTimeout !== newGuild.afkTimeout) {
			before = oldGuild.afkTimeout ? ms(oldGuild.afkTimeout * 1e3, { 'long': true }) : 'None';
			after = newGuild.afkTimeout ? ms(newGuild.afkTimeout * 1e3, { 'long': true }) : 'None';
			change = 'afk timeout';
		} else if (oldGuild.icon !== newGuild.icon) {
			before = `[View here](${oldGuild.iconURL() ?? ''})`;
			after = `[View here](${newGuild.iconURL() ?? ''})`;
			change = 'icon';
		} else if (oldGuild.afkChannel !== newGuild.afkChannel) {
			before = oldGuild.afkChannel ? `${oldGuild.afkChannel} (${oldGuild.afkChannelID})` : 'None';
			after = newGuild.afkChannel ? `${newGuild.afkChannel} (${newGuild.afkChannelID})` : 'None';
			change = 'AFK channel';
		} else if (oldGuild.verificationLevel !== newGuild.verificationLevel) {
			before = verificationLevels[oldGuild.verificationLevel];
			after = verificationLevels[newGuild.verificationLevel];
			change = 'verification level';
		} else if (oldGuild.explicitContentFilter !== newGuild.explicitContentFilter) {
			const arr = [
				'Don\'t scan any messages.',
				'Scan messages from members without a role.',
				'Scan messages sent by all members.',
			];
			before = arr[oldGuild.explicitContentFilter];
			after = arr[newGuild.explicitContentFilter];
			change = 'explicit content filter';
		} else if (oldGuild.ownerID !== newGuild.ownerID) {
			executor = await this.client.users.fetch(oldGuild.ownerID);
			before = Log.formatUser(executor);
			after = Log.formatUser(await this.client.users.fetch(newGuild.ownerID)!);
			change = 'owner';
			// eslint-disable-next-line no-negated-condition
		} else if (oldGuild.region !== newGuild.region) {
			before = humanizedRegions[oldGuild.region as keyof typeof humanizedRegions];
			after = humanizedRegions[newGuild.region as keyof typeof humanizedRegions];
			change = 'region';
		} else { return; }
		const embed = new SpectreEmbed()
			.setAuthor(`Server ${change} was changed`, emojis.all)
			.setFooter(`Server ID: ${newGuild.id}`)
			.setTimestamp()
			.setColor('ORANGE')
			.setDescription(`
				${executor ? `▫️ **Updated by:** ${Log.formatUser(executor)}` : ''}
				▫️ **Old ${change}:** ${before}
				▫️ **New ${change}:** ${after}
			`);
		channel.send(embed);
	}
}