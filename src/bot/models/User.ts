import { Entity, PrimaryColumn, Column } from 'typeorm';

export interface Backgrounds {
	rank: string;
	levelUp: string;
	color: number;
}

@Entity('users')
export class User {
	@PrimaryColumn({ type: 'bigint' })
	public id!: string;

	@Column({ 'type': 'jsonb', 'default': (): string => "'{}'" })
	public backgrounds!: any;

	@Column({ 'type': 'int', 'default': 0 })
	public credits!: number;

	@Column({ 'type': 'int', 'default': 0 })
	public reputation!: number;
}