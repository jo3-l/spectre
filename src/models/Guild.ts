import { Column, Entity, PrimaryColumn } from 'typeorm';

@Entity('guilds')
export class Guild {
	@PrimaryColumn({ type: 'bigint' })
	public id!: string;

	@Column({ 'default': (): string => "'{}'", 'nullable': true, 'type': 'jsonb' })
	public settings!: any;
}