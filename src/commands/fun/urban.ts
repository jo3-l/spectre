import { Command } from 'discord-akairo';
import { Message, MessageEmbed, TextChannel } from 'discord.js';
import fetch from 'node-fetch';
import RichDisplay from '../../util/RichDisplay';
import { stringify } from 'querystring';

const trim = (str: string, max: number) => ((str.length > max) ? `${str.slice(0, max - 3)}...` : str);
const addLinks = (str: string) => str
	// eslint-disable-next-line max-len
	.replace(/\[(.*?)\]/g, (_, word: string) => `[${word}](https://www.urbandictionary.com/define.php?${stringify({ term: word })})`);

export default class UrbanDictionaryCommand extends Command {
	public constructor() {
		super('urban', {
			aliases: ['urban', 'urban-dictionary', 'ud'],
			description: {
				content: 'Search urban dictionary from the comfort of your Discord server!',
				usage: '<term>',
				examples: ['lmao'],
			},
			category: 'Fun',
			clientPermissions: ['SEND_MESSAGES', 'EMBED_LINKS'],
			channel: 'guild',
			args: [
				{
					id: 'result',
					match: 'text',
					type: async (_, phrase) => {
						if (!phrase) return;
						const query = stringify({ term: phrase });
						const { list } = await fetch(`https://api.urbandictionary.com/v0/define?${query}`)
							.then(res => res.json());
						if (!list.length) return;
						return list;
					},
					prompt: {
						start: 'what would you like to search for?',
						retry: 'sorry, I couldn\'t find a definition with that query. Try again!',
					},
				},
			],
		});
	}

	public exec(message: Message, { result }: { result: Definition[] }) {
		const display = new RichDisplay({
			filter: (_, user) => user.id === message.author.id,
			channel: message.channel as TextChannel,
		});
		for (const definition of result) display.add(this._buildEmbed(definition));
		display
			.transformAll((page, i, total) => page.setTitle(`${page.title} | ${i + 1} of ${total}`))
			.build();
	}

	private _buildEmbed({ definition, permalink, thumbs_up, thumbs_down, example, word, author }: Definition) {
		return new MessageEmbed()
			.setTitle(`Definition for ${word}`)
			.setAuthor(author, '', `https://www.urbandictionary.com/author.php?${stringify({ author })}`)
			.setColor(this.client.config.color)
			.setURL(permalink)
			.setFooter(`👍 ${thumbs_up} | 👎 ${thumbs_down}`)
			.setDescription(trim(addLinks(definition), 2048) || '*No definition was provided.*')
			.addField('Example', trim(addLinks(example), 1024) || '*No example was provided.*');
	}
}

interface Definition {
	definition: string;
	permalink: string;
	thumbs_up: number;
	author: string;
	word: string;
	defid: number;
	written_on: string;
	example: string;
	thumbs_down: number;
}