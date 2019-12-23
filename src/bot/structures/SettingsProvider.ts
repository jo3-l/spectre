/**
 * I took heavy inspiration from iCrawl's implementation of a Provider for TypeORM (see below)
 * @author iCrawl <github.com/iCrawl> with his TypeORMProvider in the Haruana repo.
 * @see {@link github.com/Naval-Base/haruana|Github}
 */

import { Provider } from 'discord-akairo';
import { Guild as DiscordGuild, Snowflake } from 'discord.js';
import { Repository } from 'typeorm';
import { Guild } from '../models/Guild';

type Log = 'messages' | 'members' | 'join' | 'server' | 'voice';

interface Settings {
	logs: { [key in Log]: boolean | Snowflake };
	rewardType: 'stack' | 'highest';
	roleRewards: { [level: string]: Snowflake };
	backgrounds: {
		levelUp: string;
		rankCard: string;
	};
	prefix: string;
	disabledCommands: string[];
	disabledModules: string[];
}

type GuildResolvable = DiscordGuild | Snowflake;

export default class TypeORMProvider extends Provider {
	public ['constructor']: typeof TypeORMProvider;

	public constructor(private readonly repo: Repository<Guild>) {
		super();
	}

	public async init() {
		const settings = await this.repo.find();
		for (const setting of settings) {
			this.items.set(setting.id, setting.settings);
		}
	}

	public get<K extends keyof Settings, T = undefined>(
		guild: GuildResolvable,
		key: K,
		defaultValue?: T,
	): Settings[K] | T {
		const id = this.constructor.resolveId(guild);
		if (this.items.has(id)) {
			const value = this.items.get(id)[key];
			return value ?? defaultValue;
		}

		return defaultValue as T;
	}

	public async set<K extends keyof Settings>(
		guild: GuildResolvable,
		key: K,
		value: Settings[K],
	) {
		const id = this.constructor.resolveId(guild);
		const data = this.items.get(id) ?? {};
		data[key] = value;
		this.items.set(id, data);

		return this.repo
			.createQueryBuilder()
			.insert()
			.into(Guild)
			.values({ id, settings: data })
			.onConflict('("id") DO UPDATE SET "settings" = :settings')
			.setParameter('settings', data)
			.execute();
	}

	public async delete<K extends keyof Settings>(
		guild: GuildResolvable,
		key: K,
	) {
		const id = this.constructor.resolveId(guild);
		const data = this.items.get(id) ?? {};
		delete data[key];

		return this.repo
			.createQueryBuilder()
			.insert()
			.into(Guild)
			.values({ id, settings: data })
			.onConflict('("id") DO UPDATE SET "settings" = :settings')
			.setParameter('settings', null)
			.execute();
	}

	public async clear(guild: GuildResolvable) {
		const id = this.constructor.resolveId(guild);
		this.items.delete(id);

		return this.repo.delete(id);
	}

	private static resolveId(guild: GuildResolvable) {
		if (guild instanceof DiscordGuild) return guild.id;
		if (typeof guild === 'string' && /^\d+$/.test(guild)) return guild;
		throw new TypeError('Unable to resolve ID based on the guild or ID provided.');
	}
}