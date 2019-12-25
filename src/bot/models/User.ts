import { Entity, PrimaryColumn, Column } from 'typeorm';

@Entity('users')
export class User {
	@PrimaryColumn({ type: 'bigint' })
	public id!: string;

	@Column({ 'type': 'jsonb', 'default': (): string => "'{}'" })
	public backgrounds!: any;
}