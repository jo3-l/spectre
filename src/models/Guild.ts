import { Entity, PrimaryColumn, Column } from 'typeorm';

@Entity('guilds')
export class Guild {
	@PrimaryColumn({ type: 'bigint' })
	public id!: string;

	@Column({ 'type': 'jsonb', 'default': (): string => "'{}'", 'nullable': true })
	public settings!: any;
}