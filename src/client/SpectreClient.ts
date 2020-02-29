import { activities, color, db, emojis, owner, prefix, token, version } from '@root/config';
import { Guild } from '@schemas/Guild';
import ActivityHandler, { Activity } from '@structures/ActivityHandler';
import AssetHandler from '@structures/AssetHandler';
import Database from '@structures/Database';
import Logger from '@structures/Logger';
import TypeORMProvider from '@structures/SettingsProvider';
import { AkairoClient, CommandHandler, InhibitorHandler, ListenerHandler } from 'discord-akairo';
import { readdir } from 'fs-nextra';
import { join } from 'path';
import { Connection } from 'typeorm';

declare module 'discord-akairo' {
	interface AkairoClient {
		version: string;
		logger: typeof Logger;
		db: Connection;
		settings: TypeORMProvider;
		config: SpectreConfig;
		commandHandler: CommandHandler;
		inhibitorHandler: InhibitorHandler;
		listenerHandler: ListenerHandler;
		activityHandler: ActivityHandler;
		assetHandler: AssetHandler;
	}
}

export interface SpectreConfig {
	prefix: string | string[];
	token: string;
	color: number;
	version: string;
	emojis: { success: string; loading: string; error: string; neutral: string };
	db: string;
	owner: string;
	activities?: Activity[];
}

export default class SpectreClient extends AkairoClient {
	public version = version;
	public commandHandler: CommandHandler = new CommandHandler(this, {
		aliasReplacement: /-/g,
		allowMention: true,
		argumentDefaults: {
			prompt: {
				cancel: 'The command has been cancelled.',
				ended: 'Three tries and you still didn\'t get it. Try again.',
				modifyRetry: (message, str) => `${message.author}, ${str}\n\n*Type \`cancel\` to cancel the command.*`,
				modifyStart: (message, str) => `${message.author}, ${str}\n\n*Type \`cancel\` to cancel the command.*`,
				retries: 3,
				time: 30000,
				timeout: 'The command timed out.',
			},
		},
		commandUtil: true,
		commandUtilLifetime: 300000,
		defaultCooldown: 3000,
		directory: join(__dirname, '..', 'commands'),
		handleEdits: true,
		ignoreCooldown: owner,
		prefix,
		storeMessages: true,
	});

	public inhibitorHandler: InhibitorHandler = new InhibitorHandler(this, {
		directory: join(__dirname, '..', 'inhibitors'),
	});

	public listenerHandler: ListenerHandler = new ListenerHandler(this, {
		directory: join(__dirname, '..', 'listeners'),
	});

	public logger = Logger;
	public db!: Connection;
	public settings!: TypeORMProvider;
	public config = { activities, color, db, emojis, owner, prefix, token, version };
	public activityHandler: ActivityHandler = new ActivityHandler(this, this.config.activities);
	public assetHandler: AssetHandler = new AssetHandler(join(__dirname, '..', 'assets'));

	public constructor() {
		super({ ownerID: owner });
	}

	public async start() {
		await this._init();
		this.login(token);
	}

	private async _init() {
		this.logger.info('Spectre is starting up...');
		// Load extensions
		const extensionDir = join(__dirname, '..', 'extensions');
		const extensions = await readdir(extensionDir);
		// eslint-disable-next-line @typescript-eslint/no-require-imports
		for (const extension of extensions) require(`${extensionDir}/${extension}`);
		this.logger.info(`Loaded ${extensions.length} extensions.`);
		// Load handlers
		this.commandHandler
			.useInhibitorHandler(this.inhibitorHandler)
			.useListenerHandler(this.listenerHandler);
		// Load commands
		this.commandHandler.loadAll();
		this.logger.info(`Loaded ${this.commandHandler.modules.size} commands.`);
		// Set emitters
		this.listenerHandler.setEmitters({
			commandHandler: this.commandHandler,
			inhibitorHandler: this.inhibitorHandler,
			listenerHandler: this.listenerHandler,
			process,
		});
		// Load inhibitors
		this.inhibitorHandler.loadAll();
		this.logger.info(`Loaded ${this.inhibitorHandler.modules.size} inhibitors.`);
		// Load listeners
		this.listenerHandler.loadAll();
		this.logger.info(`Loaded ${this.listenerHandler.modules.size} listeners.`);
		// Connect to database
		this.db = Database.get('spectre');
		await this.db.connect();
		this.logger.info('Connected to database.');
		// Initialize the Settings Provider
		this.settings = new TypeORMProvider(this.db.getRepository(Guild));
		await this.settings.init();
		this.logger.info('Initialized the Settings Provider.');
		// Load assets
		await this.assetHandler.init();
		this.logger.info(`Loaded ${this.assetHandler.size} assets.`);
	}
}