import { Column, Entity, PrimaryColumn } from 'typeorm';

@Entity('members')
export class Member {
	@PrimaryColumn({ type: 'bigint' })
	public id!: string;

	@PrimaryColumn({ type: 'bigint' })
	public guildId!: string;

	@Column({ 'default': () => 0, 'type': 'int' })
	public xp!: number;
}