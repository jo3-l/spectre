/* eslint-disable sort-keys-fix/sort-keys-fix */
/* eslint-disable sort-keys */
import { replaceResultTransformer, TemplateTag } from 'common-tags';
import { PermissionString, User } from 'discord.js';
import moment from 'moment';
import fetch from 'node-fetch';

/* Utilies for strings */
export function ordinal(cardinal: number) {
	const cent = cardinal % 100;
	const dec = cardinal % 10;

	if (cent >= 10 && cent <= 20) return `${cardinal}th`;
	switch (dec) {
		case 1: return `${cardinal}st`;
		case 2: return `${cardinal}nd`;
		case 3: return `${cardinal}rd`;
		default: return `${cardinal}th`;
	}
}

export const escapeAllMentions = (str: string) => str.replace(/@/g, `@${String.fromCharCode(8203)}`);

export const formatUser = (user: User) => `${user.tag} (${user.id})`;

export const formatTime = (time = new Date()) => moment.utc(time).format('YYYY/MM/DD HH:mm:ss [(UTC)]');

export const codeblock = (content: string, lang = '') => (
	`\`\`\`${lang}\n${content}\`\`\``
);

export const escapedCodeblock = (content: string, lang = '') => (
	codeblock(content.replace(/`/g, `\`${String.fromCharCode(8203)}`), lang)
);

export const capitalize = (word: string) => `${word[0].toUpperCase()}${word.substr(1).toLowerCase()}`;

export const humanizePermissionName = (permission: PermissionString) => (
	permission
		.split(/_/g)
		.map(word => ['VAD', 'TTS'].includes(word) ? word : capitalize(word))
		.join(' ')
);

export const trim = (str: string, length: number | EmbedLimits, cutoff = '...') => (
	str.length > length
		? `${str.slice(0, length - 3)}${cutoff}`
		: str
);

export enum EmbedLimits {
	Title = 256,
	Author = 256,
	Description = 2048,
	FieldTitle = 256,
	FieldValue = 1024,
	EmbedFooter = 2048,
}

export const removeBlankLines = new TemplateTag(
	replaceResultTransformer(/^\s*[\n\r]/gm, ''),
);

export async function hastebin(content: string, {
	url = 'https://hasteb.in', extension = 'js',
} = { extension: 'js', url: 'https://hasteb.in' }) {
	const res = await fetch(`${url}/documents`, {
		body: content,
		headers: { 'Content-Type': 'text/plain' },
		method: 'POST',
	});

	if (!res.ok) throw new Error(res.statusText);
	const { key } = await res.json() as { key: string };
	return `${url}/${key}.${extension}`;
}

/* Level utilities */
export const calculateLevel = (xp: number) => Math.floor(0.1 * Math.sqrt(xp));

export const calculateXp = (level: number) => Math.floor(100 * (level ** 2));

/* Misc utilities */
export const emojis = {
	'a': '🇦', 'b': '🇧', 'c': '🇨', 'd': '🇩',
	'e': '🇪', 'f': '🇫', 'g': '🇬', 'h': '🇭',
	'i': '🇮', 'j': '🇯', 'k': '🇰', 'l': '🇱',
	'm': '🇲', 'n': '🇳', 'o': '🇴', 'p': '🇵',
	'q': '🇶', '0': '0⃣', 'r': '�', '1': '1⃣',
	's': '�', '2': '2⃣', 't': '�', '3': '3⃣',
	'u': '�', '4': '4⃣', 'v': '🇻', '10': '🔟',
	'w': '🇼', '!': '❗', 'x': '🇽', '#': '#',
	'y': '🇾', '*': '*', 'z': '🇿', '5': '5',
	'6': '6⃣', '7': '7', '8': '8',
	'9': '9⃣', '?': '❓',
};

export function emojify(str: string) {
	return [...str].map(v => (
		v in emojis ? emojis[v as keyof typeof emojis] : ' '
	)).join('');
}