import { MessageEmbed, MessageEmbedOptions } from 'discord.js';
import { color } from '@root/config';

export default class SpectreEmbed extends MessageEmbed {
	public constructor(data: MessageEmbed | MessageEmbedOptions = { color }) {
		super(data);
	}
}