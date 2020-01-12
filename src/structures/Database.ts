import { ConnectionManager } from 'typeorm';
import { join } from 'path';
import { db } from '@root/config';

const connectionManager = new ConnectionManager();
connectionManager.create({
	name: 'spectre',
	type: 'postgres',
	url: db,
	entities: [join(__dirname, '..', 'models/*.{ts,js}')],
	synchronize: Boolean(process.env.DEV),
});

export default connectionManager;