import { version as packageVersion } from './package.json';

// Prefix(es)
export const prefix = ['s!', 'Spectre', 'Spectre,'];
// Bot token
export const token = '';
// ID of owner
export const owner = '';
// Embed color
export const color = 14232643;
// Version
export const version = '0.5.0 Beta' || packageVersion;
// Database connection URI
export const db = '';
// Emojis
export const emojis = {
	loading: '',
	success: '',
	error: '',
};
// Array of activities
export const activities = [
	{ activity: version },
	{ activity: 'Spectre, help', type: 'LISTENING' },
];