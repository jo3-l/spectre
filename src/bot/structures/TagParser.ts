import { User, Guild, GuildMember, TextChannel, MessageEmbed } from 'discord.js';
import { ordinal } from '../../util/Util';

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
			membercount: guild.memberCount.toString(),
			membercountordinal: ordinal(guild.memberCount),
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
		.split('.')
		.map(item => item.toLowerCase());
	if (!templates || !(struct in templates)) return;
	const data = templates[struct as keyof Templates];
	if (!data) return;
	if (isObject(data) && prop in (data as object)) return (data as { [key: string]: string })[prop];

	return data.toString();
}

export function compile(expr: string, templates: Templates) {
	return expr.replace(
		/({{(.*?)}})/g,
		(_, all: string, expression: string) => parseOne(expression, templates) ?? all,
	);
}

export function compileEmbed(resolvable: string, templates: Templates): MessageEmbed | EmbedParseErrors {
	const ignoredParts = ['timestamp', 'type', 'video', 'provider', 'length', 'hexColor', 'createdAt', 'color'];
	let parsed: object;
	let embed: MessageEmbed;
	try {
		parsed = JSON.parse(resolvable);
		embed = new MessageEmbed(parsed);
	} catch {
		return EmbedParseErrors.Invalid;
	}
	for (const [part, value] of Object.entries(embed)) {
		if (ignoredParts.includes(part)) continue;
		if (part === 'author') {
			if (value?.name) embed[part]!.name = compile(value.name, templates);
		} else if (part === 'fields') {
			embed[part] = embed[part].map(field => ({
				name: compile(field.name, templates),
				value: compile(field.value, templates),
				inline: field.inline,
			}));
		} else if (part === 'footer') {
			if (value?.text) embed[part]!.text = compile(value.text, templates);
		} else if (['image', 'thumbnail'].includes(part)) {
			if (value?.url) embed[part as 'image' | 'thumbnail']!.url = compile(value.url, templates);
		} else if (typeof value === 'string') {
			(embed as unknown as { [key: string]: string })[part] = compile(value, templates);
		}
	}
	return embed.length ? embed : EmbedParseErrors.NoContent;
}

interface Context {
	user: User;
	guild: Guild;
	member: GuildMember;
	channel: TextChannel;
	level?: number;
	image?: string;
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
		membercount: string;
		membercountordinal: string;
	};
	level?: number;
	image?: string;
	rb: '{';
	lb: '}';
}