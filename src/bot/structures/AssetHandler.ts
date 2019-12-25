import { readdir, readFile } from 'fs';
import { promisify } from 'util';
import { join } from 'path';
import { Collection } from 'discord.js';

const readdirAsync = promisify(readdir);
const readFileAsync = promisify(readFile);

interface Image {
	buffer: Buffer;
	id: number;
	type: 'levelup' | 'rank';
	url: string;
}

const GITHUB_CDN = 'https://raw.githubusercontent.com/Jo3-L/spectre/master/src/assets/social';

export default class AssetHandler extends Collection<string, Image> {
	public constructor(private readonly directory: string) {
		super();
	}

	public async init() {
		const levelUpDir = join(this.directory, 'social', 'levelup');
		const rankDir = join(this.directory, 'social', 'rank');

		const levelUpFiles = await readdirAsync(levelUpDir);
		const rankFiles = await readdirAsync(rankDir);

		for (const levelUpFile of levelUpFiles) {
			const id = Number(levelUpFile.replace('.png', '.'));
			this.set(`levelup-${id}`, {
				buffer: await readFileAsync(join(levelUpDir, levelUpFile)),
				id,
				type: 'levelup',
				url: `${GITHUB_CDN}/levelup/${id}.png`,
			});
		}

		for (const rankFile of rankFiles) {
			const id = Number(rankFile.replace('.png', ''));
			this.set(`rank-${id}`, {
				buffer: await readFileAsync(join(rankDir, rankFile)),
				id,
				type: 'rank',
				url: `${GITHUB_CDN}/rank/${id}.png`,
			});
		}
	}

	public fetch({ id, type }: { id: number; type: 'levelup' | 'rank' }): Image {
		return this.get(`${type}-${id}`)!;
	}
}