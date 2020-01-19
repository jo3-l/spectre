import { db } from '@root/config';
import { join } from 'path';
import { ConnectionManager } from 'typeorm';

const connectionManager = new ConnectionManager();
connectionManager.create({
	entities: [join(__dirname, '..', 'models/*.{ts,js}')],
	name: 'spectre',
	synchronize: Boolean(process.env.DEV),
	type: 'postgres',
	url: db,
});

export default connectionManager;