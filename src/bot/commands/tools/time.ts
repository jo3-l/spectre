import { Command } from 'discord-akairo';
import { MessageEmbed, Message } from 'discord.js';
import { findFromCityStateProvince as findTz } from 'city-timezones';
import * as moment from 'moment';
import 'moment-timezone';

const VANCOUVER_DATA = {
	city: 'Vancouver',
	city_ascii: 'Vancouver',
	lat: 49.27341658,
	lng: -123.1216442,
	pop: 1458415,
	country: 'Canada',
	iso2: 'CA',
	iso3: 'CAN',
	province: 'British Columbia',
	timezone: 'America/Vancouver',
};

export default class TimeCommand extends Command {
	public constructor() {
		super('time', {
			aliases: ['time', 'current-time', 'ctime'],
			category: 'Tools',
			description: {
				content: 'Get\'s the time of a certain place. Defaults to showing Vancouver time.',
				usage: '[place]',
				examples: ['Vancouver', 'Chicago', ''],
			},
			args: [
				{
					'id': 'place',
					'default': 'Vancouver',
				},
			],
			clientPermissions: ['EMBED_LINKS', 'SEND_MESSAGES'],
		});
	}

	public exec(message: Message, { place }: { place: string }) {
		const found = findTz(place);
		const { timezone, city } = found[0] ?? VANCOUVER_DATA;
		const momentData = moment().tz(timezone);
		const time = momentData.format('dddd, MMMM Do YYYY, h:mm:ss a');

		message.util!.send(new MessageEmbed()
			.setAuthor(`Time in ${city}`, 'https://cdn4.iconfinder.com/data/icons/small-n-flat/24/clock-512.png')
			.setDescription(time)
			.addField('Timezone', timezone)
			.setFooter(`Timezone: ${momentData.format('zz')}`)
			.setColor(this.client.config.color));
	}
}