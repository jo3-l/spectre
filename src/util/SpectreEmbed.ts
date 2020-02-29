import { color } from '@root/config';
import { MessageEmbed, MessageEmbedOptions } from 'discord.js';

export default class SpectreEmbed extends MessageEmbed {
	public constructor(data: MessageEmbed | MessageEmbedOptions = { color }) {
		super(data);
	}
}