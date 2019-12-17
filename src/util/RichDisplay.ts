import { MessageEmbed, TextChannel, MessageReaction, User, Message } from 'discord.js';

export default class RichDisplay {
	private readonly emojis = { first: '⏪', prev: '◀️', stop: '⏹️', next: '▶️', last: '⏩' };
	private readonly filter: (reaction: MessageReaction, user: User) => boolean = () => true;
	private readonly timeout: number;
	private pages: MessageEmbed[];
	private page = 0;
	private startPage: MessageEmbed | number | null = null;
	private endPage: MessageEmbed | number | null = null;
	private readonly channel: TextChannel;
	private message!: Message;

	public constructor({ filter, timeout, pages, channel }: RichDisplayOptions = { timeout: 5 * 6e4, pages: [] }) {
		if (!channel) throw new Error('A channel must be provided.');
		this.channel = channel;
		if (filter) this.filter = filter;
		this.timeout = timeout;
		this.pages = pages;
	}

	public add(page: MessageEmbed) {
		this.pages.push(page);
		return this;
	}

	private jump(index: number) {
		if (this.page !== index) this.page = index;
		this.message.edit(this.pages[index]);
	}

	public setStart(page: MessageEmbed | number) {
		if (typeof page === 'number' && this.pages[page]) {
			this.page = page;
			return this;
		}
		this.startPage = page;
		return this;
	}

	public setEnd(page: MessageEmbed | number) {
		if (typeof page === 'number' && this.pages[page]) {
			this.endPage = page;
			return this;
		}
		this.endPage = page;
		return this;
	}

	public transformAll(fn: (page: MessageEmbed, i: number, length: number) => MessageEmbed) {
		const { length } = this.pages;
		this.pages = this.pages.map((page, i) => fn(page, i, length));
		return this;
	}

	public async build() {
		if (!this.pages.length) throw new Error('There must be at least 1 page to start the paginator.');
		const message = await this.channel.send(typeof this.startPage === 'number' ? this.pages[this.startPage] : this.startPage || this.pages[0]);
		this.message = message;
		for (const emoji of Object.values(this.emojis)) await message.react(emoji);
		const collector = message.createReactionCollector(this.filter, { time: this.timeout });

		collector.on('collect', (reaction, user) => {
			switch (reaction.emoji.name) {
				case this.emojis.first:
					this.jump(0);
					break;
				case this.emojis.prev:
					if (this.pages[this.page - 1]) this.jump(--this.page);
					break;
				case this.emojis.stop:
					message.reactions.removeAll();
					collector.stop();
					break;
				case this.emojis.next:
					this.jump(++this.page);
					break;
				case this.emojis.last:
					this.jump(this.pages.length - 1);
					break;
			}
			message.reactions.get(reaction.emoji.name)!.users.remove(user.id);
		});

		collector.on('end', () => {
			message.reactions.removeAll();
			if (typeof this.endPage === 'number') message.edit(this.pages[this.endPage]);
			else if (this.endPage) message.edit(this.endPage);
		});
	}
}

interface RichDisplayOptions {
	filter?: (reaction: MessageReaction, user: User) => boolean;
	timeout: number;
	pages: MessageEmbed[];
	channel?: TextChannel;
}