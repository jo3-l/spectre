// eslint-disable-next-line max-len
import { MessageEmbed, GuildAuditLogsActions, Invite, TextChannel, User, Guild, PermissionString, GuildAuditLogsEntry } from 'discord.js';
import { Log } from './SettingsProvider';
import SpectreClient from '../client/SpectreClient';
import moment from 'moment';

export const requiredPermissions: PermissionString[] = ['VIEW_AUDIT_LOG', 'EMBED_LINKS', 'MANAGE_WEBHOOKS'];

export default {
	fetchChannel(guild: Guild, type: Log) {
		const id = (guild.client as SpectreClient).settings.get(guild, 'logs')?.[type];
		if (!id) return;
		const channel = guild.client.channels.get(id) as TextChannel | undefined;
		if (!channel) return;
		const permChecks = channel.permissionsFor(channel.guild.me!)?.has(requiredPermissions) ??
			channel.guild.me!.permissions.has(requiredPermissions);
		if (!permChecks) return;
		return channel;
	},

	async send(channel: TextChannel, embed: MessageEmbed) {
		const webhooks = await channel.fetchWebhooks();
		const webhook = webhooks.find(w => (w.owner as PartialUser | undefined)?.id === w.client.user!.id) ||
			await channel.createWebhook('Spectre', { avatar: channel.client.user!.displayAvatarURL({ size: 1024 }) });
		webhook.send({ embeds: [embed] }).catch(() => null);
	},

	async getEntry(guild: Guild, auditType: keyof GuildAuditLogsActions) {
		return guild.fetchAuditLogs({ type: auditType, limit: 1 })
			// eslint-disable-next-line promise/prefer-await-to-then
			.then(audit => audit.entries.first())
			.catch(() => undefined);
	},

	async getExecutor(
		{ guild, id }: { guild: Guild; id: string | null },
		type: keyof GuildAuditLogsActions,
		_entry?: GuildAuditLogsEntry,
	) {
		const entry = _entry ?? await this.getEntry(guild, type);
		if (!entry || !entry.target || Math.abs(Date.now() - entry.createdTimestamp) > 5000 ||
			(!(entry.target instanceof Invite) && entry.target.id !== id)) return;
		return entry.executor;
	},

	formatUser(user: User) {
		return `${user.tag} (ID ${user.id})`;
	},

	formatTime(time: Date = new Date()) {
		return moment.utc(time).format('YYYY/MM/DD HH:mm:ss [(UTC)]');
	},
};

interface PartialUser { id: string }