import { MessageEmbed, GuildAuditLogsActions, Invite, TextChannel } from 'discord.js';
import { promisify } from 'util';
const wait = promisify(setTimeout);

export default {
	ignore(channel: TextChannel) {
		return !(
			channel.permissionsFor(channel.guild.me!)?.has(['VIEW_AUDIT_LOG', 'EMBED_LINKS', 'MANAGE_WEBHOOKS']) ??
			channel.guild.me!.permissions.has(['VIEW_AUDIT_LOG', 'EMBED_LINKS', 'MANAGE_WEBHOOKS'])
		);
	},

	async send(channel: TextChannel, embed: MessageEmbed) {
		if (this.ignore(channel)) return;
		const webhooks = await channel.fetchWebhooks();
		const webhook = webhooks.find(w => (w.owner as PartialUser | undefined)?.id === w.client.user!.id) ||
			await channel.createWebhook('Spectre Logging', { avatar: channel.client.user!.displayAvatarURL({ size: 1024 }) });
		webhook.send({ embeds: [embed] }).catch(() => null);
	},

	async fetchEntry(channel: TextChannel, auditType: keyof GuildAuditLogsActions) {
		if (this.ignore(channel)) return;
		return channel.guild.fetchAuditLogs({ type: auditType, limit: 1 })
			// eslint-disable-next-line promise/prefer-await-to-then
			.then(audit => audit.entries.first())
			.catch(() => null);
	},

	async getExecutor({ channel, id }: { channel: TextChannel; id: string | null }, type: keyof GuildAuditLogsActions) {
		if (this.ignore(channel)) return;
		await wait(1000);
		const entry = await this.fetchEntry(channel, type);
		if (!entry || !entry.target || Math.abs(Date.now() - entry.createdTimestamp) > 5000 ||
			(!(entry.target instanceof Invite) && entry.target.id !== id)) return;
		return entry.executor;
	},
};

interface PartialUser { id: string }