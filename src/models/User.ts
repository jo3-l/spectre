import { Column, Entity, PrimaryColumn } from 'typeorm';

@Entity('users')
export class User {
	@PrimaryColumn({ type: 'bigint' })
	public id!: string;

	@Column({ 'default': (): string => "'{}'", 'type': 'jsonb' })
	public backgrounds!: any;
}