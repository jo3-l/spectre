import { AkairoModule } from 'discord-akairo';

import Logger from '../structures/Logger';

declare module 'discord-akairo' {
	interface AkairoModule {
		logger: typeof Logger;
	}
}

Object.defineProperty(AkairoModule.prototype, 'logger', { value: Logger });