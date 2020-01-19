import SpectreEmbed from '@structures/SpectreEmbed';
import { CATEGORIES } from '@util/constants';
import { oneLine } from 'common-tags';
import { Command } from 'discord-akairo';
import { Message, User } from 'discord.js';

export default class BlacklistStatusCommand extends Command {
	public constructor() {
		super('blacklist-status', {
			args: [
				{
					id: 'user',
					prompt: {
						retry: 'that was not a valid user. Try again.',
						start: 'please provide a user to check.',
					},
					type: async (_, phrase) => {
						if (!phrase) return;
						const user = await this.client.users.fetch(phrase).catch(() => null);
						if (!user) return;
						return user;
					},
				},
			],
			category: CATEGORIES.OWNER,
		});
	}

	public exec(message: Message, { user }: { user: User }) {
		const blacklist = this.client.settings.get('global', 'blacklist', []);
		const isBlacklisted = blacklist.includes(user.id);
		const embed = new SpectreEmbed()
			.setColor(isBlacklisted ? 'RED' : 'GREEN')
			.setAuthor(`❯ Blacklist status for ${user.tag}`, user.displayAvatarURL())
			.setDescription(oneLine`${isBlacklisted ? this.client.emojis.success : this.client.emojis.error} 
				**${user.tag}** ${isBlacklisted ? 'is' : 'is not'} blacklisted!`);
		message.util!.send(embed);
	}
}