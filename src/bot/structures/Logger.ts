import { format, createLogger, transports } from 'winston';
import * as moment from 'moment';
import { hex, red, yellow, green, blue } from 'chalk';
import { inspect } from 'util';
import { oneLine } from 'common-tags';

const LEVEL_COLORS = {
	error: red,
	warn: yellow,
	info: green,
	debug: blue,
};

export default createLogger({
	format: format.combine(
		format.errors({ stack: true }),
		format.label({ label: 'BOT' }),
		format.timestamp({ format: 'YYYY/MM/DD HH:mm:ss' }),
		format.printf(info => {
			const { timestamp, label, level } = info;
			let { message } = info;
			if (level === 'debug' && typeof message !== 'string') message = inspect(message);
			const display = moment().format('kk:mm');
			const color = LEVEL_COLORS[level as 'error' | 'warn' | 'info' | 'debug'];
			return oneLine`${hex('#FF8800')(display)} |
				${color(`[${timestamp}] ${label} - ${level.toUpperCase()}: `)} ${message}`;
		}),
	),
	levels: { error: 0, warn: 1, info: 2, debug: 3 },
	transports: [new transports.Console({ level: 'debug' })],
});