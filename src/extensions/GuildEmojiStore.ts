import { emojis } from '@root/config';
import { GuildEmojiManager } from 'discord.js';

declare module 'discord.js' {
	interface GuildEmojiManager {
		loading: string;
		success: string;
		error: string;
		neutral: string;
	}
}

Object.defineProperties(
	GuildEmojiManager.prototype,
	{
		error: { value: emojis.error },
		loading: { value: emojis.loading },
		neutral: { value: emojis.neutral },
		success: { value: emojis.success },
	},
);