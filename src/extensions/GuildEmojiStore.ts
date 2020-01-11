import { emojis } from '../../config';
import { GuildEmojiStore } from 'discord.js';

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
		loading: { value: emojis.loading },
		success: { value: emojis.success },
		error: { value: emojis.error },
		neutral: { value: emojis.neutral },
	},
);