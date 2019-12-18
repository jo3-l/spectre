import { Entity, PrimaryColumn, Column } from 'typeorm';

@Entity('members')
export class Member {
	@PrimaryColumn({ type: 'bigint' })
	public id!: string;

	@PrimaryColumn({ type: 'bigint' })
	public guildId!: string;

	@Column({ 'type': 'int', 'default': () => '0' })
	public xp!: number;
}