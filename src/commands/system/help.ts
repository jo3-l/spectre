import { Command, Category, Argument } from 'discord-akairo';
import { Message } from 'discord.js';
import SpectreEmbed from '@structures/SpectreEmbed';
import { oneLineTrim } from 'common-tags';

const mapCommands = (category: Category<string, Command>) => {
	const result = [];
	for (const command of category.values()) {
		if (!command.aliases.length) continue;
		result.push(`\`${command.aliases[0]}\``);
	}
	return result;
};

export default class HelpCommand extends Command {
	public constructor() {
		super('help', {
			aliases: ['help', 'h', 'cmd', 'cmds', 'module', 'command', 'category'],
			category: 'System',
			description: {
				content: 'Information on specific commands or modules.',
				usage: '[command|module]',
				examples: ['ping', 'General'],
			},
			clientPermissions: ['EMBED_LINKS', 'SEND_MESSAGES'],
			ratelimit: 2,
		});
	}

	public *args(message: Message) {
		const moduleTypeCaster = (_: Message, phrase: string) => this.handler.findCategory(phrase);
		let type = moduleTypeCaster;
		if (!['category', 'module', 'cmds'].includes(message.util!.parsed!.alias!)) {
			type = Argument.union('commandAlias', moduleTypeCaster);
		}
		const module = yield { type };
		return { module };
	}

	public exec(message: Message, { module }: { module?: Category<string, Command> | Command }) {
		const prefix = (this.handler.prefix as string[])[0];
		const desc = oneLineTrim`A list of commands is below.
		Use \`${prefix}help [command]\` for more detailed information on a command.`;
		let embed = new SpectreEmbed();

		if (!module) {
			embed = embed
				.setThumbnail(this.client.user!.displayAvatarURL())
				.setDescription(desc)
				.setTitle('Spectre Help');
			for (const category of this.handler.categories.values()) {
				embed.addField(category.id, mapCommands(category).join(' '));
			}
			return message.util!.send(embed.boldFields());
		}
		if (module instanceof Category) {
			return message.util!.send(embed
				.setThumbnail(this.client.user!.displayAvatarURL())
				.setTitle(`Category: ${module}`)
				.setDescription(desc)
				.addField('Commands', mapCommands(module).join(' '))
				.boldFields());
		}
		const { aliases, description: { examples, usage, content }, ratelimit, cooldown, category } = module;
		return message.util!.send(embed
			.setTitle(`\`${aliases[0]}${usage ? ` ${usage}` : ''}\``)
			.addField('Aliases', aliases.map(a => `\`${a}\``).join(' '))
			.addField('Description', content)
			// eslint-disable-next-line max-len
			.addField('Examples', examples.map((example?: string) => `\`${prefix}${aliases[0]}${example ? ` ${example}` : ''}\``).join('\n'))
			.setFooter(`Cooldown: ${ratelimit || 1}/${cooldown ? cooldown : 3}s | Category: ${category}`)
			.setThumbnail(this.client.config.categoryImages[category.id.toLowerCase()])
			.boldFields());
	}
}