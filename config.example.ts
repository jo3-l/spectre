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
// Images used in help command
export const categoryImages = {
	animals: 'https://cdn1.iconfinder.com/data/icons/animal-flat-2/128/animal_fox-forest-512.png',
	fun: 'https://webstockreview.net/images/emoji-clipart-celebration-4.png',
	levels: 'https://cdn1.iconfinder.com/data/icons/business-1-48/50/18-512.png',
	// eslint-disable-next-line max-len
	reddit: 'https://2.bp.blogspot.com/-r3brlD_9eHg/XDz5bERnBMI/AAAAAAAAG2Y/XfivK0eVkiQej2t-xfmlNL6MlSQZkvcEACK4BGAYYCw/s1600/logo%2Breddit.png',
	system: 'https://cdn3.iconfinder.com/data/icons/illustricon-tech/512/development.browser.gears.-512.png',
	settings: 'http://lh3.ggpht.com/v0Na9wm3dVQlJ6eiGchC8FoUVgnSY4ik0yOLZwyeX1iieMJ_byckvj9yEHp8IpVzCXty=w300',
	owner: 'https://cdn4.iconfinder.com/data/icons/social-messaging-ui-color-and-shapes-5/177800/219-512.png',
	info: 'https://cdn.pixabay.com/photo/2016/06/26/23/32/information-1481584_960_720.png',
	tools: 'https://icons-for-free.com/iconfiles/png/512/control+options+repair+setting+tools+icon-1320168142481040816.png',
};