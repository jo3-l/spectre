import { Command } from 'discord-akairo';
import { Message, User } from 'discord.js';
import SpectreEmbed from '@structures/SpectreEmbed';
import { oneLine } from 'common-tags';

export default class BlacklistStatusCommand extends Command {
	public constructor() {
		super('blacklist-status', {
			category: 'Owner',
			args: [
				{
					id: 'user',
					type: async (_, phrase) => {
						if (!phrase) return;
						const user = await this.client.users.fetch(phrase).catch(() => null);
						if (!user) return;
						return user;
					},
					prompt: {
						start: 'please provide a user to check.',
						retry: 'that was not a valid user. Try again.',
					},
				},
			],
		});
	}

	public exec(message: Message, { user }: { user: User }) {
		const blacklist = this.client.settings.get('global', 'blacklist', [] as string[]);
		const isBlacklisted = blacklist.includes(user.id);
		const embed = new SpectreEmbed()
			.setColor(isBlacklisted ? 'RED' : 'GREEN')
			.setAuthor(`Blacklist status for ${user.tag}`, user.displayAvatarURL())
			.setDescription(oneLine`${isBlacklisted ? this.client.emojis.success : this.client.emojis.error} 
				**${user.tag}** ${isBlacklisted ? 'is' : 'is not'} blacklisted!`);
		message.util!.send(embed);
	}
}