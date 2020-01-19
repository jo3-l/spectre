/* eslint-disable max-len */
import { bold, red } from 'chalk';
import { stripIndent, stripIndents } from 'common-tags';
import { Listener } from 'discord-akairo';

export default class extends Listener {
	public constructor() {
		super('ready', {
			emitter: 'client',
			event: 'ready',
			type: 'once',
		});
	}

	public async exec() {
		this.logger.info(`Logged in as ${this.client.user!.tag}.`);
		this.client.activityHandler.start();
		this.logger.info('Set activity and started the Activity Handler.');
		const owner = await this.client.users.fetch(
			Array.isArray(this.client.ownerID) ? this.client.ownerID[0] : this.client.ownerID,
		).then(user => user.tag);
		console.log(stripIndents`
			${red(stripIndent`
			\u200b
			 _____                   _            
			/ ____|                 | |           
			| (___  _ __    ___  ___| |_ _ __ ___ 
			\\___  \\ |'_  \\ / _ \\/ __| __| '__/ _ \\
			____) | | _)  |  __/ (__| |_| | |  __/
			|_____/ | .__/ \\___|\\___|\\__|_|  \\___|
				| |                           
				|_|
			`)}

			Spectre has started, with ${bold(this.client.commandHandler.modules.size)} commands in a total of ${bold(this.client.commandHandler.categories.size)} categories.
			Below are some statistics:

			${bold('• Mode:')} ${process.env.DEV ? 'Development' : 'Production'}
			${bold('• Version:')} ${this.client.version}
			${bold('• Guilds:')} ${this.client.guilds.size}
			${bold('• Total users:')} ${this.client.users.size}
			${bold('• Bot instance:')} ${this.client.user!.tag}
			${bold('• Bot instance owned by:')} ${owner}
			${bold('• GitHub:')} https://github.com/jo3-l/spectre
			${bold('• Created by:')} Joe L. (https://github.com/jo3-l)

			Copyright MIT License, 2019-present.
		`);
	}
}