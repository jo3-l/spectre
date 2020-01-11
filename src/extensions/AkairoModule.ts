import Logger from '../structures/Logger';
import { AkairoModule } from 'discord-akairo';

declare module 'discord-akairo' {
	interface AkairoModule {
		logger: typeof Logger;
	}
}

Object.defineProperty(AkairoModule.prototype, 'logger', { value: Logger });