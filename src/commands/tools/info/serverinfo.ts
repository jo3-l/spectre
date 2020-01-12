import { Command } from 'discord-akairo';
import { Message } from 'discord.js';
import SpectreEmbed from '@structures/SpectreEmbed';
import { emojify } from '../../../util/Util';
import { commaListsAnd } from 'common-tags';

export const humanizedRegions = {
	'brazil': `${emojify('br')} Brazil`,
	'europe': `${emojify('eu')} Europe`,
	'singapore': `${emojify('sg')} Singapore`,
	'us-central': `${emojify('us')} U.S. Central`,
	'us-east': `${emojify('us')} U.S. East`,
	'us-south': `${emojify('us')} U.S. South`,
	'us-west': `${emojify('us')} U.S. West`,
	'sydney': `${emojify('au')} Sydney`,
	'hongkong': `${emojify('hk')} Hong Kong`,
	'russia': `${emojify('ru')} Russia`,
	'southafrica': `${emojify('za')} South Africa`,
	'india': `${emojify('in')} India`,
	'japan': `${emojify('jp')} Japan`,
};

export const verificationLevels = [
	'None: Unrestricted',
	'Low: Must have a verified email on their Discord account.',
	'Medium: Must also be a member of this server for longer than 10 minutes.',
	'(╯°□°）╯︵ ┻━┻: Must also be a member of this server for longer than 10 minutes.',
	'┻━┻ ﾐヽ(ಠ益ಠ)ノ彡┻━┻: Must have a verified phone on their Discord account.',
];

export default class ServerInfoCommand extends Command {
	public constructor() {
		super('server-info', {
			aliases: ['server-info', 'guild-info', 'guild', 'server'],
			category: 'Info',
			description: {
				content: 'Some information about the server.',
				usage: '',
				examples: [''],
			},
			channel: 'guild',
			clientPermissions: ['EMBED_LINKS', 'SEND_MESSAGES'],
		});
	}

	public async exec(message: Message) {
		const guild = message.guild!;
		const suffixes = ['Text', 'Store', 'Voice', 'Category'];
		const data = guild.channels.reduce((acc, channel) => {
			if (!['category', 'news', 'text', 'store', 'voice'].includes(channel.type)) return acc;
			const key = channel.type === 'news' ? 'text' : channel.type as keyof typeof acc;
			acc[key]++;
			return acc;
		}, { text: 0, store: 0, voice: 0, category: 0 });
		const embed = new SpectreEmbed()
			.setAuthor(`${guild.name} (ID ${guild.id})`, guild.iconURL() || '')
			.setThumbnail(guild.iconURL() || '')
			.addField('❯ ID', guild.id)
			.addField('❯ Channels', commaListsAnd`• ${Object.values(data).map((v, i) => `${v} ${suffixes[i]}`)}
				• AFK: ${guild.afkChannel?.toString() ?? 'None'}`)
			.addField('❯ Membercount', `${guild.memberCount}`)
			.addField('❯ Owner', `${(await guild.members.fetch(guild.ownerID)).user.tag} (${guild.ownerID})`)
			.addField('❯ Roles', guild.roles.size)
			.addField('❯ Region', humanizedRegions[guild.region as keyof typeof humanizedRegions])
			.addField('❯ Verification Level', verificationLevels[guild.verificationLevel])
			.setFooter('Created at')
			.setTimestamp(guild.createdAt)
			.boldFields();
		message.util!.send(embed);
	}
}