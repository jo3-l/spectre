import { format, createLogger, transports } from 'winston';
import moment from 'moment';
import { hex, red, yellow, green, blue } from 'chalk';

const orange = hex('#FF8800');

const levelColors = {
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
		format.splat(),
		format.printf(info => {
			const { timestamp, label, level, message } = info;
			const displayedTime = moment().format('kk:mm');
			const color = levelColors[level as keyof typeof levelColors];
			return `${orange(displayedTime)} | ${color(`[${timestamp}] ${label} - ${level.toUpperCase()}: `)} ${message}`;
		}),
	),
	levels: { error: 0, warn: 1, info: 2, debug: 3 },
	transports: [new transports.Console({ level: 'debug' })],
});