import { MessageEmbed, MessageEmbedOptions } from 'discord.js';
import { color } from '../../config';

export default class SpectreEmbed extends MessageEmbed {
	public constructor(data: MessageEmbed | MessageEmbedOptions = { color }) {
		super(data);
	}

	public boldFields(): this {
		for (const field of this.fields) field.name = `**${field.name}**`;
		return this;
	}
}