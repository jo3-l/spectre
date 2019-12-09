import { ConnectionManager } from 'typeorm';
import { join } from 'path';
import { db } from '../../../config';

const connectionManager = new ConnectionManager();
connectionManager.create({
	name: 'spectre',
	type: 'postgres',
	url: db,
	entities: [join(__dirname, 'entities/*.ts')],
	synchronize: true,
});

export default connectionManager;