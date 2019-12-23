import { Command } from 'discord-akairo';
import { Message, MessageEmbed } from 'discord.js';

export default class InviteCommand extends Command {
	public constructor() {
		super('invite', {
			aliases: ['invite', 'inv'],
			category: 'System',
			description: {
				usage: '',
				content: 'Sends a link to invite Spectre to your server.',
				examples: [''],
			},
			clientPermissions: ['EMBED_LINKS'],
			ratelimit: 2,
		});
	}

	public exec(message: Message) {
		// eslint-disable-next-line max-len
		const inviteLink = `https://discordapp.com/api/oauth2/authorize?client_id=${this.client.user!.id}&permissions=8&scope=bot`;
		return message.util!.send(new MessageEmbed()
			.setAuthor('Spectre Invite Link', this.client.user!.displayAvatarURL())
			.setDescription(`Click [here](${inviteLink}) to invite Spectre to your server!`)
			.setColor(this.client.config.color));
	}
}