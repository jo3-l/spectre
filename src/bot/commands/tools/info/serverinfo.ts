import { Command } from 'discord-akairo';
import { Message, MessageEmbed } from 'discord.js';
import { emojify } from '../../../../util/Util';
import { commaListsAnd, oneLine } from 'common-tags';

const HUMAN_REGIONS: Regions = {
	'brazil': `${emojify('br')} Brazil`,
	'eu-central': `${emojify('eu')} Central Europe`,
	'singapore': `${emojify('sg')} Singapore`,
	'us-central': `${emojify('us')} U.S. Central`,
	'us-east': `${emojify('us')} U.S. East`,
	'us-south': `${emojify('us')} U.S. South`,
	'us-west': `${emojify('us')} U.S. West`,
	'eu-west': `${emojify('eu')} Western Europe`,
	'syndney': `${emojify('au')} Sydney`,
	'london': `${emojify('gb')} London`,
	'amsterdam': `${emojify('nl')} Amsterdam`,
	'hongkong': `${emojify('hk')} Hong Kong`,
	'russia': `${emojify('ru')} Russia`,
	'southafrica': `${emojify('za')} South Africa`,
};

const verificationLevels = ['None', 'Low', 'Medium', '(╯°□°）╯︵  ┻━┻', '┻━┻ミヽ(ಠ益ಠ)ノ彡┻━┻'];

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
			clientPermissions: ['EMBED_LINKS'],
		});
	}

	public async exec(message: Message) {
		const guild = message.guild!;
		const suffixes = ['Text', 'Store', 'Voice', 'Category'];
		let textAmt: ChannelAmountType = 0;
		let storeAmt: ChannelAmountType = 0;
		let voiceAmt: ChannelAmountType = 0;
		let categoryAmt: ChannelAmountType = 0;
		for (const channel of guild.channels.values()) {
			switch (channel.type) {
				case 'category':
					++categoryAmt;
					break;
				case 'news':
				case 'text':
					++textAmt;
					break;
				case 'store':
					++storeAmt;
					break;
				case 'voice':
					++voiceAmt;
					break;
			}
		}
		const embed = new MessageEmbed()
			.setColor(this.client.config.color)
			.setAuthor(`${guild.name} (ID ${guild.id})`, guild.iconURL() ?? '')
			.setThumbnail(guild.iconURL() ?? '')
			.addField('ID', guild.id)
			// eslint-disable-next-line max-len
			.addField('Channels', commaListsAnd`• ${[textAmt, storeAmt, voiceAmt, categoryAmt].map((v, i) => oneLine`${v} ${suffixes[i]}`)}
				• AFK: ${guild.afkChannel?.toString() ?? 'None'}`)
			.addField('Membercount', `${guild.memberCount}`)
			.addField('Owner', `${(await guild.members.fetch(guild.ownerID)).user.tag} (${guild.ownerID})`)
			.addField('Roles', guild.roles.size)
			.addField('Region', HUMAN_REGIONS[guild.region])
			.addField('Verification Level', verificationLevels[guild.verificationLevel])
			.setFooter('Created at')
			.setTimestamp(guild.createdAt);
		message.util!.send(embed);
	}
}

type ChannelAmountType = number | string | null;
interface Regions { [key: string]: string }