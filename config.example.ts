import { Activity } from '@structures/ActivityHandler';

// Prefix(es)
export const prefix = ['s!', 'Spectre', 'Spectre,'];
// Bot token
export const token = '';
// ID of owner
export const owner = '';
// Embed color
export const color = 14232643;
// Version
export const version = '0.5.0 Beta';
// Database connection URI
export const db = '';
// Emojis
export const emojis = {
	loading: '',
	success: '',
	error: '',
	neutral: '',
};
// Array of activities
export const activities: Activity[] = [
	{ activity: `v${version}` },
	{ activity: 'Spectre, help', type: 'LISTENING' },
];