import { CATEGORIES } from '@util/constants';
import SpectreEmbed from '@util/SpectreEmbed';
import { emojify } from '@util/util';
import { commaListsAnd } from 'common-tags';
import { Command } from 'discord-akairo';
import { Message } from 'discord.js';

export const humanizedRegions = {
	'brazil': `${emojify('br')} Brazil`,
	'europe': `${emojify('eu')} Europe`,
	'hongkong': `${emojify('hk')} Hong Kong`,
	'india': `${emojify('in')} India`,
	'japan': `${emojify('jp')} Japan`,
	'russia': `${emojify('ru')} Russia`,
	'singapore': `${emojify('sg')} Singapore`,
	'southafrica': `${emojify('za')} South Africa`,
	'sydney': `${emojify('au')} Sydney`,
	'us-central': `${emojify('us')} U.S. Central`,
	'us-east': `${emojify('us')} U.S. East`,
	'us-south': `${emojify('us')} U.S. South`,
	'us-west': `${emojify('us')} U.S. West`,
};

export const verificationLevels = {
	HIGH: '(╯°□°）╯︵ ┻━┻: Must also be a member of this server for longer than 10 minutes.',
	LOW: 'Low: Must have a verified email on their Discord account.',
	MEDIUM: 'Medium: Must also be a member of this server for longer than 10 minutes.',
	NONE: 'None: Unrestricted',
	VERY_HIGH: '┻━┻ ﾐヽ(ಠ益ಠ)ノ彡┻━┻: Must have a verified phone on their Discord account.',
};

export default class ServerInfoCommand extends Command {
	public constructor() {
		super('server-info', {
			aliases: ['server-info', 'guild-info', 'guild', 'server'],
			category: CATEGORIES.INFO,
			channel: 'guild',
			clientPermissions: ['EMBED_LINKS', 'SEND_MESSAGES'],
			description: {
				content: 'Some information about the server.',
				examples: [''],
				usage: '',
			},
		});
	}

	public async exec(message: Message) {
		const guild = message.guild!;
		const suffixes = ['Text', 'Store', 'Voice', 'Category'];
		const data = guild.channels.cache.reduce((acc, channel) => {
			if (!['category', 'news', 'text', 'store', 'voice'].includes(channel.type)) return acc;
			const key = channel.type === 'news' ? 'text' : channel.type;
			acc[key]++;
			return acc;
		}, { category: 0, store: 0, text: 0, voice: 0 });
		const embed = new SpectreEmbed()
			.setAuthor(`${guild.name} (ID ${guild.id})`, guild.iconURL() || '')
			.setThumbnail(guild.iconURL() || '')
			.addField('❯ ID', guild.id)
			.addField('❯ Channels', commaListsAnd`• ${Object.values(data).map((v, i) => `${v} ${suffixes[i]}`)}
				• AFK: ${guild.afkChannel?.toString() ?? 'None'}`)
			.addField('❯ Membercount', `${guild.memberCount}`)
			.addField('❯ Owner', `${(await guild.members.fetch(guild.ownerID)).user.tag} (${guild.ownerID})`)
			.addField('❯ Roles', guild.roles.cache.size)
			.addField('❯ Region', humanizedRegions[guild.region as keyof typeof humanizedRegions])
			.addField('❯ Verification Level', verificationLevels[guild.verificationLevel])
			.setFooter('Created at')
			.setTimestamp(guild.createdAt);
		message.util!.send(embed);
	}
}