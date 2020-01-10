import { Command } from 'discord-akairo';
import { Message, MessageEmbed } from 'discord.js';
import { duration } from 'moment';
import 'moment-duration-format';

export default class StatCommands extends Command {
	public constructor() {
		super('stats', {
			aliases: ['stats', 'info'],
			category: 'System',
			description: {
				content: 'Spectre statistics!',
				examples: [''],
				usage: '',
			},
			clientPermissions: ['EMBED_LINKS', 'SEND_MESSAGES'],
			ratelimit: 2,
		});
	}

	public exec(message: Message) {
		return message.util!.send(new MessageEmbed()
			.setAuthor('Spectre Statistics', this.client.user!.displayAvatarURL())
			.setThumbnail(this.client.user!.displayAvatarURL())
			.addField('**Uptime**', duration(this.client.uptime!).format('D [days] H [hours] m [mins] s [secs]'))
			.addField('**Memory Usage**', `${(Math.round((process.memoryUsage().heapUsed / 1024 / 1024) * 10)) / 10} MB`)
			.addField('**General Statistics**', `• Guilds: ${this.client.guilds.size}\n• Channels: ${this.client.channels.size}`)
			.addField('**Version**', `v${this.client.version}`)
			.addField('**Library**', '[discord.js](https://discord.js.org)[-akairo](https://discord-akairo.github.io \'akairo\')')
			.addField('**Github**', 'Spectre is open-source! View it [here](https://github.com/Jo3-L/spectre).')
			.setColor(this.client.config.color));
	}
}