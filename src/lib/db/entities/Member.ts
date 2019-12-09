import { Entity, PrimaryColumn, Column, BeforeInsert } from 'typeorm';

@Entity('members')
export class Member {
	@PrimaryColumn({ type: 'bigint' })
	public id!: string;

	@PrimaryColumn({ type: 'bigint' })
	public guildId!: string;

	@Column('int')
	public xp!: number;

	@BeforeInsert()
	public setDefault() {
		this.xp = 0;
	}
}