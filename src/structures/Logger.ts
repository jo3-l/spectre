import { blue, green, hex, red, yellow } from 'chalk';
import moment from 'moment';
import { createLogger, format, transports } from 'winston';

const orange = hex('#FF8800');

const levelColors = {
	debug: blue,
	error: red,
	info: green,
	warn: yellow,
};

export default createLogger({
	format: format.combine(
		format.errors({ stack: true }),
		format.label({ label: 'BOT' }),
		format.timestamp({ format: 'YYYY/MM/DD HH:mm:ss' }),
		format.splat(),
		format.printf(info => {
			const { timestamp, label, level, message } = info;
			const displayedTime = moment().format('kk:mm');
			const color = levelColors[level as keyof typeof levelColors];
			return `${orange(displayedTime)} | ${color(`[${timestamp}] ${label} - ${level.toUpperCase()}: `)} ${message}`;
		}),
	),
	levels: { debug: 3, error: 0, info: 2, warn: 1 },
	transports: [new transports.Console({ level: 'debug' })],
});