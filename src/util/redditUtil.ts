import SpectreEmbed from '@util/SpectreEmbed';
import fetch from 'node-fetch';
import { stringify } from 'querystring';

export async function scrapeSubreddit({
	subreddit = 'dankmemes',
	limit = 100,
	t = 'day',
	sort = 'top',
	filterNSFW: filterNsfw = true,
}: RedditScrapeOptions) {
	const params = stringify({ limit, t });
	const url = `https://www.reddit.com/r/${subreddit}/${sort}/.json?${params}`;
	let data = (await fetch(url).then(res => res.json()) as RedditApiResponse).data.children;
	if (filterNsfw) data = data.filter(({ data: postData }) => !postData.over_18);
	if (!data.length) return Promise.reject('NO_ITEMS_FOUND');
	const post = data.random().data;
	return {
		...post,
		embed() {
			return new SpectreEmbed()
				.setTitle(post.title.length > 256 ? `${post.title.slice(0, 253)}...` : post.title)
				.setColor('RANDOM')
				.setFooter(`👍 ${post.ups} | 💬 ${post.num_comments}`)
				.setURL(`https://reddit.com/${post.permalink}`)
				.setImage(post.url);
		},
	};
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
		children: RedditPost[];
	};
}

interface RedditPost {
	embed: SpectreEmbed;
	kind: string;
	data: {
		over_18: boolean;
		title: string;
		created: number;
		ups: number;
		num_comments: number;
		permalink: string;
		url: string;
	};
}