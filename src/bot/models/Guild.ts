import { Entity, PrimaryColumn, Column } from 'typeorm';

export enum RewardType {
	STACK = 'stack',
	HIGHEST = 'highest',
}
export interface RoleRewards {
	[key: string]: string;
}
export interface Backgrounds {
	rank: string;
	levelUp: string;
	color: number;
}

@Entity('guilds')
export class Guild {
	@PrimaryColumn({ type: 'bigint' })
	public id!: string;

	@Column({ 'type': 'jsonb', 'default': (): string => "'{}'" })
	public roleRewards!: RoleRewards;

	@Column({ 'type': 'enum', 'enum': RewardType, 'default': RewardType.STACK })
	public rewardType!: RewardType;

	@Column({ 'type': 'jsonb', 'default': (): string => "'{}'" })
	public backgrounds!: Backgrounds;
}