import Log, { emojis } from '@structures/Log';
import { VoiceState } from 'discord.js';
import { Listener } from 'discord-akairo';
import { removeBlankLines, formatUser } from '@util/Util';
import SpectreEmbed from '@structures/SpectreEmbed';

export default class VoiceStateUpdateListener extends Listener {
	public constructor() {
		super('voiceStateUpdate', {
			event: 'voiceStateUpdate',
			emitter: 'client',
		});
	}

	public async exec(oldState: VoiceState, newState: VoiceState) {
		const { guild } = newState;
		const channel = await Log.fetchChannel(guild, 'voice');
		if (!channel) return;
		const user = await this.client.users.fetch(newState.id);
		if (oldState.channelID !== newState.channelID) {
			if (newState.channelID) {
				const embed = new SpectreEmbed()
					.setAuthor(`${user.tag} joined #${newState.channel!.name}`, emojis.all)
					.setFooter(`User ID: ${user.id}`)
					.setColor('GREEN')
					.setTimestamp()
					.setDescription(removeBlankLines`
						▫️ **Member:** ${formatUser(user)}
						▫️ **Voice channel:** ${newState.channel} (${newState.channel!.id})
					`);
				return channel.send(embed);
			}
			const embed = new SpectreEmbed()
				.setAuthor(`${user.tag} left #${oldState.channel!.name}`, emojis.all)
				.setFooter(`User ID: ${user.id}`)
				.setColor('RED')
				.setTimestamp()
				.setDescription(removeBlankLines`
						▫️ **Member:** ${formatUser(user)}
						▫️ **Old voice channel:** ${oldState.channel!} (${oldState.channel!.id})
					`);
			return channel.send(embed);
		}
		if (oldState.deaf !== newState.deaf) {
			const type = !oldState.deaf && newState.deaf ? 1 : 0;
			const embed = new SpectreEmbed()
				.setAuthor(`${user.tag} ${type ? 'was deafened' : 'was undeafened'}`, emojis.all)
				.setColor(type ? 'RED' : 'GREEN')
				.setTimestamp()
				.setFooter(`User ID: ${user.id}`)
				.setDescription(`
					▫️ **Member:** ${formatUser(user)}
					▫️ **Voice channel:** ${newState.channel} (${newState.channel!.id})
				`);
			return channel.send(embed);
		}
		if (oldState.mute !== newState.mute) {
			const type = !oldState.mute && newState.mute ? 1 : 0;
			const embed = new SpectreEmbed()
				.setAuthor(`${user.tag} ${type ? 'was muted' : 'was unmuted'}`, emojis.all)
				.setColor(type ? 'RED' : 'GREEN')
				.setTimestamp()
				.setFooter(`User ID: ${user.id}`)
				.setDescription(`
					▫️ **Member:** ${formatUser(user)}
					▫️ **Voice channel:** ${newState.channel} (${newState.channel!.id})
				`);
			return channel.send(embed);
		}
		if (oldState.streaming !== newState.streaming) {
			const embed = new SpectreEmbed()
				.setAuthor(`${user.tag} ${oldState.streaming ? 'stopped' : 'started'} streaming`, emojis.all)
				.setColor(oldState.streaming ? 'RED' : 'GREEN')
				.setTimestamp()
				.setFooter(`User ID: ${user.id}`)
				.setDescription(`
					▫️ **Member:** ${formatUser(user)}
					▫️ **Voice channel:** ${newState.channel} (${newState.channel!.id})
				`);
			return channel.send(embed);
		}
	}
}