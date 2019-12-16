import { AkairoClient, CommandHandler, InhibitorHandler, ListenerHandler, AkairoModule } from 'discord-akairo';
import { join } from 'path';
import { token, prefix, activities, owner, version, color, db } from '../../../config';
import ActivityHandler, { Activity } from '../../util/ActivityHandler';
import SpectreLogger from '../../util/Logger';
import Database from '../db/index';
import { Logger } from 'winston';
import { Connection } from 'typeorm';

AkairoModule.prototype.logger = SpectreLogger;

export interface SpectreConfig {
	prefix: string | string[];
	token: string;
	color: number;
	version: string;
	db: string;
	owner: string;
	activities?: Activity[];
}

export default class SpectreClient extends AkairoClient {
	public version = version;
	public commandHandler: CommandHandler = new CommandHandler(this, {
		directory: join(__dirname, '..', 'commands'),
		aliasReplacement: /-/g,
		allowMention: true,
		prefix: prefix,
		handleEdits: true,
		storeMessages: true,
		commandUtil: true,
		commandUtilLifetime: 300000,
		ignoreCooldown: owner,
		defaultCooldown: 3000,
		argumentDefaults: {
			prompt: {
				modifyStart: (message, str) => `${message.author}, ${str}\n\n*Type \`cancel\` to cancel the command.*`,
				modifyRetry: (message, str) => `${message.author}, ${str}\n\n*Type \`cancel\` to cancel the command.*`,
				timeout: 'The command timed out.',
				ended: 'Three tries and you still didn\'t get it. Try again.',
				cancel: 'The command has been cancelled.',
				retries: 3,
				time: 30000,
			},
		},
	});

	public inhibitorHandler: InhibitorHandler = new InhibitorHandler(this, {
		directory: join(__dirname, '..', 'inhibitors'),
	});

	public listenerHandler: ListenerHandler = new ListenerHandler(this, {
		directory: join(__dirname, '..', 'listeners'),
	});

	public logger = SpectreLogger;
	public db = Database.get('spectre');
	public config = { token, prefix, color, owner, db, activities, version };
	public activityHandler: ActivityHandler = new ActivityHandler(this, activities);

	public constructor() {
		super({
			ownerID: owner, disableEveryone: true, disabledEvents: ['TYPING_START'],
		});
	}

	private async init() {
		this.commandHandler.useInhibitorHandler(this.inhibitorHandler);
		this.commandHandler.useListenerHandler(this.listenerHandler);
		this.logger.info('Set handlers for the commandHandler.');
		this.commandHandler.loadAll();
		this.logger.info('Loaded all commands.');
		this.listenerHandler.setEmitters({
			commandHandler: this.commandHandler,
			listenerHandler: this.listenerHandler,
			inhibitorHandler: this.inhibitorHandler,
			process: process,
		});
		this.logger.info('Set emitters for the listenerHandler.');
		this.inhibitorHandler.loadAll();
		this.logger.info('Loaded all inhibitors.');
		this.listenerHandler.loadAll();
		this.logger.info('Loaded all listeners.');
		await this.db.connect();
		this.logger.info('Connected to database.');
	}

	public async start() {
		await this.init();
		this.login(token);
	}
}

declare module 'discord-akairo' {
	interface AkairoClient {
		version: string;
		logger: Logger;
		db: Connection;
		config: SpectreConfig;
		commandHandler: CommandHandler;
		inhibitorHandler: InhibitorHandler;
		listenerHandler: ListenerHandler;
		activityHandler: ActivityHandler;
	}

	interface AkairoModule {
		logger: Logger;
	}
}