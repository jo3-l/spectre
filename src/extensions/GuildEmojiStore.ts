import { GuildEmojiStore } from 'discord.js';

import { emojis } from '../../config';

declare module 'discord.js' {
	interface GuildEmojiStore {
		loading: string;
		success: string;
		error: string;
		neutral: string;
	}
}

Object.defineProperties(
	GuildEmojiStore.prototype,
	{
		error: { value: emojis.error },
		loading: { value: emojis.loading },
		neutral: { value: emojis.neutral },
		success: { value: emojis.success },
	},
);