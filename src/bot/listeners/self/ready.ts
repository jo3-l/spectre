/* eslint-disable max-len */
import { Listener } from 'discord-akairo';
import { red, bold } from 'chalk';
import { stripIndents, stripIndent } from 'common-tags';

export default class extends Listener {
	public constructor() {
		super('ready', {
			emitter: 'client',
			event: 'ready',
			category: 'Self',
			type: 'once',
		});
	}

	public async exec() {
		this.logger.info(`Logged in as ${this.client.user!.tag}.`);
		this.client.activityHandler.start();
		this.logger.info('Set activity and started the activity handler.');
		const owner = await this.client.users.fetch(
			Array.isArray(this.client.ownerID) ? this.client.ownerID[0] : this.client.ownerID,
		).then(user => user.tag);
		console.log(stripIndents`
			${red(stripIndent`
			\u200b
			 _____                  _            
			/ ____|                | |           
			| (___  _ __   ___  ___| |_ _ __ ___ 
			\\___  \\ |'_  \\ / _ \\/ __| __| '__/ _ \\
			____) | | _)  |  __/ (__| |_| | |  __/
			|_____/ | .__/ \\___|\\___|\\__|_|  \\___|
				| |                           
				|_|
			`)}

			Spectre has started, with ${bold(this.client.commandHandler.modules.size)} commands in ${bold(this.client.commandHandler.categories.size)} categories.
			Below are some statistics:

			${bold('• Version:')} ${this.client.version}
			${bold('• Guilds:')} ${this.client.guilds.size}
			${bold('• Total Users:')} ${this.client.users.size}
			${bold('• Bot instance:')} ${this.client.user!.tag}
			${bold('• Bot instance owned by:')} ${owner}
			${bold('• GitHub:')} https://jo3-l/spectre
			${bold('• Created by:')} Joe L. (https://github.com/jo3-l)

			Copyright MIT License, 2019-present.
		`);
	}
}