import { Command } from 'discord-akairo';
import { Guild, Message, MessageEmbed } from 'discord.js';
import { stripIndents } from 'common-tags';
import * as moment from 'moment';

export default class FindServerCommand extends Command {
	public constructor() {
		super('find-server', {
			aliases: ['find-server', 'find-guild'],
			category: 'Owner',
			description: {
				content: 'Finds an individual server',
				usage: '<guild>',
				examples: ['123456789', 'SomeServerName'],
			},
			ownerOnly: true,
			clientPermissions: ['EMBED_LINKS'],
			ratelimit: 2,
			args: [
				{
					id: 'guild',
					type: 'guild',
					prompt: { start: 'what guild would you like to search for?', retry: 'please provide a valid guild.' },
				},
			],
		});
	}

	public async exec(message: Message, { guild }: { guild: Guild }) {
		message.util!.send(new MessageEmbed()
			.setColor(this.client.config.color)
			.setFooter('Spectre joined this guild at')
			.setTimestamp(guild.joinedAt)
			.setAuthor(guild.name, guild.iconURL() ?? '')
			.setThumbnail(guild.iconURL() ?? '')
			.setDescription(stripIndents`• ID: ${guild.id}

				• Membercount: ${guild.memberCount}

				• Owner: ${(await this.client.users.fetch(guild.ownerID)).tag} (${guild.ownerID})

				• Created at: ${moment(guild.createdAt).format('YYYY/MM/DD hh:mm:ss')}`));
	}
}