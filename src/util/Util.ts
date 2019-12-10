import fetch from 'node-fetch';

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

export async function hastebin(content: string, { url = 'https://hasteb.in', extension = 'js' }: IHastebinOptions = { url: 'https://hasteb.in', extension: 'js' }) {
	const res = await fetch(`${url}/documents`, {
		method: 'POST',
		body: content,
		headers: { 'Content-Type': 'text/plain' },
	});

	if (!res.ok) throw new Error(res.statusText);
	const { key } = await res.json() as IHastebinResponse;
	return `${url}/${key}.${extension}`;
}

export const calculateLevel = (xp: number) => Math.floor(0.1 * Math.sqrt(xp));
export const calculateXp = (level: number) => Math.floor(100 * (level ** 2));
/* eslint-disable */
export const emojis: IEmoji = {
	a: '🇦', b: '🇧', c: '🇨', d: '🇩',
	e: '🇪', f: '🇫', g: '🇬', h: '🇭',
	i: '🇮', j: '🇯', k: '🇰', l: '🇱',
	m: '🇲', n: '🇳', o: '🇴', p: '🇵',
	q: '🇶', r: '🇷', s: '🇸', t: '🇹',
	u: '🇺', v: '🇻', w: '🇼', x: '🇽',
	y: '🇾', z: '🇿', '0': '0⃣', '1': '1⃣',
	'2': '2⃣', '3': '3⃣', '4': '4⃣', '5': '5⃣',
	'6': '6⃣', '7': '7⃣', '8': '8⃣', '9': '9⃣',
	'10': '🔟', '#': '#⃣', '*': '*⃣',
	'!': '❗', '?': '❓',
};
/* eslint-enable */
export function emojify(str: string) {
	return [...str].map(v => emojis[v.toLowerCase()] ?? '').join('');
}
export const emotify = emojify;

interface IHastebinOptions {
	url?: string;
	extension?: string;
}
interface IHastebinResponse { key: string }
interface IEmoji {
	[key: string]: string;
}