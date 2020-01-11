import { Command, Argument, Category, Listener, Inhibitor } from 'discord-akairo';
import { Message } from 'discord.js';
import { promisify } from 'util';
import { stat } from 'fs';
import { join } from 'path';

const statAsync = promisify(stat);

export default class ReloadCommand extends Command {
	public constructor() {
		super('reload', {
			aliases: ['reload', 'r', 'reload-all'],
			category: 'Owner',
			description: {
				// eslint-disable-next-line max-len
				content: 'Reloads a category, module (command, listener, etc.), file, or all of a specific type (all commands, listeners, etc.).',
				usage: '<category|module|file|type> [--all|--new]',
				examples: ['Owner --all', 'commands --all', 'util/Util', 'xkcd'],
			},
			ownerOnly: true,
			clientPermissions: ['SEND_MESSAGES'],
			flags: ['--all', '-a'],
		});
	}

	public *args(message: Message) {
		const categoryTypeCastor = (_: Message, phrase: string) => this.handler.findCategory(phrase);
		const moduleTypeCastor = Argument.union(['commands', 'inhibitors', 'listeners'],
			categoryTypeCastor);
		const fileTypeCastor = async (_: Message, phrase: string) => {
			const BASE_URL = join(__dirname, '..', '..', '..');
			const ext = __filename.endsWith('.ts') ? '.ts' : '.js';
			const dir = join(BASE_URL, phrase.endsWith(ext) ? phrase : `${phrase}${ext}`);
			try {
				if (!(await statAsync(dir)).isDirectory()) return dir;
			} catch { }
		};
		const all = ['reload-all', 'reloadall'].includes(message.util!.parsed!.alias!)
			? true
			: yield { match: 'flag', flag: ['--all', '-a'], unordered: true };
		if (all) {
			const module = yield { type: moduleTypeCastor, unordered: true };
			return { many: module };
		}
		const file = yield { type: fileTypeCastor, match: 'content' };
		if (file) return { file };
		const module = yield {
			type: Argument.union('commandAlias', 'command', 'inhibitor', 'listener', categoryTypeCastor),
			match: 'content',
			prompt: {
				start: 'please provide a valid module to reload.',
				retry: 'that was not a valid module!',
			},
		};
		return { module };
	}

	public async exec(message: Message, { many, module, file }: ReloadCommandArgs) {
		if (many) {
			if (typeof many === 'string') {
				const handlers = {
					commands: this.handler,
					inhibitors: this.client.inhibitorHandler,
					listeners: this.client.listenerHandler,
				};
				await message.util!.send(`${this.client.emojis.loading} Reloading all ${many}...`);
				handlers[many]
					.removeAll()
					.loadAll();
				return message.util!.send(`${this.client.emojis.success} Reloaded all ${many} successfully!`);
			}
			many.reloadAll();
			return message.util!.send(`${this.client.emojis.success} Reloaded all commands in the category \`${many}\`!`);
		} else if (file) {
			const baseDirRegex = new RegExp(join(__dirname, '..', '..', '..').replace(/\\/g, '\\\\'), 'g');
			delete require.cache[require.resolve(file)];
			message.util!.send(`${this.client.emojis.success} Reloaded the file \`${file.replace(baseDirRegex, '~')}\`.`);
		} else if (module) {
			if (module instanceof Category) {
				module.reloadAll();
				return message.util!.send(`${this.client.emojis.success} Reloaded all commands in the category \`${module}\`!`);
			}
			module.reload();
			return message.util!.send(`${this.client.emojis.success} Reloaded the module \`${module}\` successfully!`);
		}
	}
}

interface ReloadCommandArgs {
	many?: 'commands' | 'inhibitors' | 'listeners' | Category<string, Command>;
	file?: string;
	module?: Command | Listener | Inhibitor | Category<string, Command>;
}