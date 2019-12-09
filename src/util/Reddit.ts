import { stringify } from 'querystring';
import fetch from 'node-fetch';
import { MessageEmbed } from 'discord.js';

export async function scrape({ subreddit = 'dankmemes', limit = 500, t = 'day', sort = 'top', filterNSFW = true }: IScrapeOptions) {
	const params = stringify({ t, limit });
	const url = `https://www.reddit.com/r/${subreddit}/${sort}/.json?${params}`;
	let data = (await fetch(url).then(res => res.json()) as IRedditAPIResponse).data.children;
	if (filterNSFW) data = data.filter(({ data: postData }) => !postData.over_18);
	if (!data.length) return Promise.reject(new Error('NO_ITEMS_FOUND'));
	return data[Math.floor(Math.random() * data.length)].data;
}

export async function constructEmbed({ title, created, ups, num_comments, permalink, url }: IRedditPostData) {
	return new MessageEmbed()
		.setTitle(title.length > 256 ? `${title.slice(0, 253)}...` : title)
		.setColor('RANDOM')
		.setTimestamp(created)
		.setFooter(`👍 ${ups} | 💬 ${num_comments}`)
		.setURL(`https://reddit.com${permalink}`)
		.setImage(url);
}

interface IScrapeOptions {
	subreddit?: string;
	limit?: number;
	filterNSFW?: boolean;
	t?: 'hour' | 'day' | 'week' | 'month' | 'year' | 'all';
	sort?: 'hot' | 'new' | 'controversial' | 'top' | 'rising';
}
interface IRedditAPIResponse {
	kind: 'Listing';
	data: {
		modhash: string;
		dist: number;
		children: IRedditPostInfo[];
	};
}
interface IRedditPostInfo {
	kind: string;
	data: IRedditPostData;
}
interface IRedditPostData {
	over_18: boolean;
	title: string;
	created: number;
	ups: number;
	num_comments: number;
	permalink: string;
	url: string;
}