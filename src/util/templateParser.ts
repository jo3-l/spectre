import SpectreEmbed from '../structures/SpectreEmbed';

enum EmbedParseErrors {
	Invalid = 0, NoContent
}

interface Templates {
	[templateName: string]: string | number | Record<string, string | number>;
}

function isObject(obj: any): obj is Record<string, string | number> {
	const type = typeof obj;
	return (type === 'function' || type === 'object') && Boolean(obj);
}

export function parseOne(template: string, templates: Templates): string | undefined {
	const [struct, prop] = template
		.replace(/ +/g, '')
		.split('.')
		.map(item => item.toLowerCase());
	if (!templates || !(struct in templates)) return;
	const data = templates[struct as keyof Templates];
	if (!data) return;
	if (isObject(data) && prop in data) return data[prop].toString();
	return data.toString();
}

export function parse(expr: string, templates: Templates) {
	templates.rb = '}';
	templates.lb = '{';
	return expr.replace(
		/({{(.*?)}})/g,
		(_, all: string, expression: string) => parseOne(expression, templates) ?? all,
	);
}

export function parseEmbed(resolvable: string, templates: Templates): SpectreEmbed | EmbedParseErrors {
	const ignoredParts = ['timestamp', 'type', 'video', 'provider', 'length', 'hexColor', 'createdAt', 'color'];
	let embed: SpectreEmbed;
	try {
		const parsed = JSON.parse(resolvable);
		embed = new SpectreEmbed(parsed);
	} catch {
		return EmbedParseErrors.Invalid;
	}
	for (const [part, value] of Object.entries(embed)) {
		if (ignoredParts.includes(part)) continue;
		if (part === 'author') {
			if (value?.name) embed[part]!.name = parse(value.name, templates);
		} else if (part === 'fields') {
			embed[part] = embed[part].map(field => ({
				name: parse(field.name, templates),
				value: parse(field.value, templates),
				inline: field.inline,
			}));
		} else if (part === 'footer') {
			if (value?.text) embed[part]!.text = parse(value.text, templates);
		} else if (['image', 'thumbnail'].includes(part)) {
			if (value?.url) embed[part as 'image' | 'thumbnail']!.url = parse(value.url, templates);
		} else if (typeof value === 'string') {
			(embed as unknown as Record<string, string>)[part] = parse(value, templates);
		}
	}
	return embed.length ? embed : EmbedParseErrors.NoContent;
}