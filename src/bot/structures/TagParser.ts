import { User, Guild, GuildMember, TextChannel, MessageEmbed } from 'discord.js';

enum EmbedParseErrors {
	Invalid = 0, NoContent
}

function isObject(obj: any) {
	const type = typeof obj;
	return (type === 'function' || type === 'object') && Boolean(obj);
}

export function createTemplates({ user, guild, member, level, image, channel }: Context): Templates {
	return {
		user: {
			id: user.id,
			discrim: user.discriminator,
			tag: user.tag,
			mention: user.toString(),
			username: user.username,
			avatar: user.displayAvatarURL(),
		},
		member: {
			nickname: member.displayName,
		},
		guild: {
			icon: guild.iconURL() || '',
			name: guild.name,
			id: guild.id,
		},
		channel: {
			name: channel.name,
			mention: channel.toString(),
		},
		level,
		image,
		rb: '{',
		lb: '}',
	};
}

export function parseOne(template: string, templates: Templates): string | undefined {
	const [struct, prop] = template
		.replace(/ +/g, '')
		.split('.').map(item => item.toLowerCase());
	if (!templates || !(struct in templates)) return;
	const data = templates[struct as keyof Templates];
	if (isObject(data) && prop in (data as object)) return (data as { [key: string]: string })[prop];
	return data.toString();
}

export function parse(expr: string, templates: Templates) {
	return expr.replace(
		/({{(.*?)}})/g,
		(_, all: string, expression: string) => parseOne(expression, templates) ?? all,
	);
}

export function parseEmbed(resolvable: string, templates: Templates): MessageEmbed | EmbedParseErrors {
	let parsed: object;
	let embed: MessageEmbed;
	try {
		parsed = JSON.parse(resolvable);
		embed = new MessageEmbed(parsed);
	} catch {
		return EmbedParseErrors.Invalid;
	}
	for (const part of Object.keys(embed)) {
		// eslint-disable-next-line max-len
		if (['timestamp', 'type', 'url', 'video', 'thumbnail', 'provider', 'length', 'hexColor', 'image', 'createdAt', 'color'].includes(part)) continue;
		if (part === 'author') {
			const cur = embed[part]?.name;
			if (cur) embed[part]!.name = parse(cur, templates);
		} else if (part === 'fields') {
			embed[part] = embed[part].map(field => ({
				name: parse(field.name, templates),
				value: parse(field.value, templates),
				inline: field.inline,
			}));
		} else if (part === 'footer') {
			if (!embed[part]?.text) continue;
			embed[part]!.text = parse(embed[part]!.text!, templates);
		} else {
			// @ts-ignore sigh...
			if (typeof embed[part] !== 'string') continue;
			// @ts-ignore sigh...
			embed[part] = parse(embed[part], templates);
		}
	}
	return embed.length ? embed : EmbedParseErrors.NoContent;
}

interface Context {
	user: User;
	guild: Guild;
	member: GuildMember;
	channel: TextChannel;
	level: number;
	image: string;
}

interface Templates {
	user: {
		id: string;
		discrim: string;
		tag: string;
		mention: string;
		username: string;
		avatar: string;
	};
	member: { nickname: string };
	channel: {
		name: string;
		mention: string;
	};
	guild: {
		icon: string;
		name: string;
		id: string;
	};
	level: number;
	image: string;
	rb: '{';
	lb: '}';
}