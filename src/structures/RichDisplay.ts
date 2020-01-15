import { TextChannel, MessageReaction, User, Message } from 'discord.js';
import SpectreEmbed from '@structures/SpectreEmbed';

export default class RichDisplay {
	private readonly _emojis = { first: '⏪', prev: '◀️', stop: '⏹️', next: '▶️', last: '⏩' };
	private readonly _filter: (reaction: MessageReaction, user: User) => boolean = () => true;
	private readonly _timeout: number;
	private _pages: SpectreEmbed[];
	private _page = 0;
	// eslint-disable-next-line @typescript-eslint/prefer-readonly
	private _start: SpectreEmbed | null = null;
	// eslint-disable-next-line @typescript-eslint/prefer-readonly
	private _end: SpectreEmbed | null = null;
	private readonly _channel: TextChannel;
	private _message!: Message;

	public constructor({ filter, timeout = 5 * 6e4, pages = [], channel }: RichDisplayOptions = {}) {
		if (!channel) throw new TypeError('A channel must be provided.');
		this._channel = channel;
		if (filter) this._filter = filter;
		this._timeout = timeout;
		this._pages = pages;
	}

	public add(page: SpectreEmbed) {
		this._pages.push(page);
		return this;
	}

	private _updatePage(index: number) {
		if (this._page !== index) this._page = index;
		this._message.edit(this._pages[index]);
	}

	public set(type: 'start' | 'end', page: SpectreEmbed | number) {
		if (typeof page === 'number' && this._pages[page - 1]) {
			this[`_${type}` as '_start' | '_end'] = this._pages[page - 1];
			this._page = page - 1;
			return this;
		}
		if (typeof page === 'number') throw new RangeError('The page provided was not in the pages set for this display.');
		this[`_${type}` as '_start' | '_end'] = page;
		return this;
	}

	public transformAll(fn: (page: SpectreEmbed, i: number, length: number) => SpectreEmbed) {
		const { length } = this._pages;
		this._pages = this._pages.map((page, i) => fn(page, i, length));
		return this;
	}

	public async build() {
		if (!this._pages.length) throw new Error('There must be at least 1 page to start the paginator.');
		const message = await this._channel.send(this._start || this._pages[0]);
		this._message = message;
		for (const emoji of Object.values(this._emojis)) await message.react(emoji);
		const collector = message.createReactionCollector(this._filter, { time: this._timeout });

		collector.on('collect', (reaction, user) => {
			switch (reaction.emoji.name) {
				case this._emojis.first:
					this._updatePage(0);
					break;
				case this._emojis.prev:
					if (this._pages[this._page - 1]) this._updatePage(--this._page);
					break;
				case this._emojis.stop:
					message.reactions.removeAll();
					collector.stop();
					break;
				case this._emojis.next:
					if (this._pages[this._page + 1]) this._updatePage(++this._page);
					break;
				case this._emojis.last:
					this._updatePage(this._pages.length - 1);
					break;
			}
			message.reactions.get(reaction.emoji.name)!.users.remove(user.id);
		});

		collector.on('end', () => {
			message.reactions.removeAll();
			if (this._end) message.edit(this._end);
		});
	}
}

interface RichDisplayOptions {
	filter?: (reaction: MessageReaction, user: User) => boolean;
	timeout?: number;
	pages?: SpectreEmbed[];
	channel?: TextChannel;
}