import translate, { languages } from '@vitalets/google-translate-api';
import { Command } from 'discord-akairo';
import { Message } from 'discord.js';
import { oneLine, stripIndents } from 'common-tags';
import SpectreEmbed from '@structures/SpectreEmbed';
import { CATEGORIES } from '@util/constants';

const getCode = (desiredLang: string) => {
	if (!desiredLang) return;
	const data = Object.entries(languages).find(([key, value]) => {
		if (typeof value !== 'string') return false;
		return [key.toLowerCase(), value.toLowerCase()].includes(desiredLang.toLowerCase());
	});
	if (!data) return;
	return data[0];
};

export default class TranslateCommand extends Command {
	public constructor() {
		super('translate', {
			aliases: ['translate'],
			category: CATEGORIES.TOOLS,
			description: {
				content: oneLine`Translates the given text. 
					Optionally, supply a language to translate from with \`--from\` and to translate to with \`--to\`.
					Supports ISO codes and language name.`,
				usage: '<text> [...flags <language>]',
				examples: ['@Joe', ''],
			},
			channel: 'guild',
			clientPermissions: ['EMBED_LINKS', 'SEND_MESSAGES'],
			args: [
				{
					id: 'to',
					match: 'option',
					flag: ['--to', '-t'],
					unordered: true,
					type: (_, phrase) => {
						if (!phrase) return;
						const code = getCode(phrase);
						if (!code) return;
						return code;
					},
					prompt: {
						optional: true,
						start: 'please provide a language to translate to.',
						retry: 'that wasn\'t a valid language, try again.',
					},
				}, {
					id: 'from',
					match: 'option',
					flag: ['--from', '-f'],
					unordered: true,
					type: (_, phrase) => {
						if (!phrase) return;
						const code = getCode(phrase);
						if (!phrase) return;
						return code;
					},
					prompt: {
						optional: true,
						start: 'please provide a language to translate from.',
						retry: 'that wasn\'t a valid language, try again.',
					},
				}, {
					id: 'text',
					match: 'rest',
					prompt: { start: 'what do you want to translate?' },
					unordered: true,
				},
			],
		});
	}

	public async exec(message: Message, { text, to, from }: { text: string; to?: string; from?: string }) {
		const res = await translate(text, { to, from }).catch(() => null);
		if (!res) {
			return message.util!.send(
				`${this.client.emojis.error} An unexpected error occured during translation. Please try again later.`,
			);
		}
		const embed = new SpectreEmbed()
			.setAuthor('Translate', 'https://i.stack.imgur.com/P6kbv.png')
			.setDescription(stripIndents`**❯ Result:**
				${res.text}
				
				**❯ Details:**
				• Translated from: \`${languages[res.from.language.iso]}\`
				• Translated to: \`${languages[to || 'en']}\`
			`)
			.setFooter('Powered by Google Translate');
		message.util!.send(embed);
	}
}