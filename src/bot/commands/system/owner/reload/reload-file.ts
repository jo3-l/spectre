import { Command } from 'discord-akairo';
import { Message } from 'discord.js';
import { promisify } from 'util';
import { stat as _stat } from 'fs';
import { join } from 'path';
const stat = promisify(_stat);

export default class ReloadFileCommand extends Command {
	public constructor() {
		super('reload-file', {
			aliases: ['reload-file'],
			category: 'Owner',
			description: {
				content: 'Reloads a file (relative to `src` directory).',
				usage: '<filepath>',
				examples: ['bot/client/SpectreClient', 'lib/util/toOrdinal'],
			},
			clientPermissions: ['SEND_MESSAGES'],
			args: [
				{
					id: 'path',
					type: async (_, phrase) => {
						const BASE_URL = join(__dirname, '..', '..', '..', '..');
						const dir = join(BASE_URL, (phrase.endsWith('.ts') ? phrase : `${phrase}.ts`));
						try {
							if (!(await stat(dir)).isDirectory()) return dir;
						} catch { }
					},
					prompt: {
						start: 'please provide a valid file.',
						retry: 'that wasn\'t a valid file. Try again.',
					},
				},
			],
		});
	}

	public exec(message: Message, { path }: { path: string }) {
		const rg = new RegExp(join(__dirname, '..', '..', '..', '..').replace(/\\/g, '\\\\'), 'g');
		delete require.cache[path];
		message.util!.reply(`reloaded the file \`${path.replace(rg, '~')}\` successfully.`);
	}
}