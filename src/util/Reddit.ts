import { stringify } from 'querystring';
import fetch from 'node-fetch';
import { MessageEmbed } from 'discord.js';

class RedditPost {
	public readonly nsfw: boolean;
	public readonly title: string;
	public readonly upvotes: number;
	public readonly comments: number;
	public readonly image: string;
	public readonly url: string;

	public constructor({ over_18, title, ups, num_comments, permalink, url }: RedditPostPartial) {
		this.nsfw = over_18;
		this.title = title;
		this.upvotes = ups;
		this.comments = num_comments;
		this.url = `https://reddit.com/${permalink}`;
		this.image = url;
	}

	public toEmbed() {
		return new MessageEmbed()
			.setTitle(this.title.length > 256 ? `${this.title.slice(0, 253)}...` : this.title)
			.setColor('RANDOM')
			.setFooter(`👍 ${this.upvotes} | 💬 ${this.comments}`)
			.setURL(this.url)
			.setImage(this.image);
	}
}

export async function scrapeSubreddit({ subreddit = 'dankmemes', limit = 500, t = 'day', sort = 'top', filterNSFW = true }: RedditScrapeOptions) {
	const params = stringify({ t, limit });
	const url = `https://www.reddit.com/r/${subreddit}/${sort}/.json?${params}`;
	let data = (await fetch(url).then(res => res.json()) as RedditApiResponse).data.children;
	if (filterNSFW) data = data.filter(({ data: postData }) => !postData.over_18);
	if (!data.length) return 'NO_ITEMS_FOUND';
	return new RedditPost(data[Math.floor(Math.random() * data.length)].data);
}

interface RedditScrapeOptions {
	subreddit?: string;
	limit?: number;
	filterNSFW?: boolean;
	t?: 'hour' | 'day' | 'week' | 'month' | 'year' | 'all';
	sort?: 'hot' | 'new' | 'controversial' | 'top' | 'rising';
}
interface RedditApiResponse {
	kind: 'Listing';
	data: {
		modhash: string;
		dist: number;
		children: RedditPostRaw[];
	};
}
interface RedditPostRaw {
	kind: string;
	data: RedditPostPartial;
}
interface RedditPostPartial {
	over_18: boolean;
	title: string;
	created: number;
	ups: number;
	num_comments: number;
	permalink: string;
	url: string;
}