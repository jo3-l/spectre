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

interface IHastebinOptions {
	url?: string;
	extension?: string;
}
interface IHastebinResponse { key: string }