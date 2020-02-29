import { Guild, GuildAuditLogsActions, GuildAuditLogsEntry, Invite, PermissionString, TextChannel } from 'discord.js';

import SpectreClient from '../client/SpectreClient';
import { Log } from '../structures/SettingsProvider';

export const requiredPermissions: PermissionString[] = ['VIEW_AUDIT_LOG', 'EMBED_LINKS', 'MANAGE_WEBHOOKS'];

export default {
	fetchChannel(guild: Guild, type: Log) {
		const id = (guild.client as SpectreClient).settings.get(guild, 'logs')?.[type];
		if (!id) return;
		const channel = guild.client.channels.cache.get(id) as TextChannel | undefined;
		if (!channel) return;
		const permChecks = channel.permissionsFor(channel.guild.me!)?.has(requiredPermissions) ??
			channel.guild.me!.permissions.has(requiredPermissions);
		if (!permChecks) return;
		return channel;
	},

	async getEntry(guild: Guild, auditType: keyof GuildAuditLogsActions) {
		return guild.fetchAuditLogs({ limit: 1, type: auditType })
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
};

export const emojis = {
	addChannel: 'https://i.imgur.com/jqsDvX7.png',
	addMember: 'https://i.imgur.com/FqpvZcA.png',
	all: 'https://i.imgur.com/MQsYYLB.png',
	createEmoji: 'https://i.imgur.com/WQtVx5l.png',
	createRole: 'https://i.imgur.com/cbq66lt.png',
	deleteChannel: 'https://i.imgur.com/KstZBdw.png',
	deleteEmoji: 'https://i.imgur.com/LMdyD3P.png',
	deleteMessage: 'https://i.imgur.com/BHKe4S9.png',
	deleteRole: 'https://i.imgur.com/2utRE50.png',
	removeMember: 'https://i.imgur.com/TJ9zdIN.png',
	updateChannel: 'https://i.imgur.com/5XPVC8s.png',
	updateEmoji: 'https://i.imgur.com/bsuD40F.png',
	updateMember: 'https://i.imgur.com/1pXc6BA.png',
	updateMessage: 'https://i.imgur.com/ZswKOog.png',
	updateRole: 'https://i.imgur.com/tqXKABH.png',
};