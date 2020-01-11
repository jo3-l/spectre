declare module 'google-translate-api' {
	export default function translate(text: string, options: { from: string; to: string }): Response;
	export const languages: Record<string, string> & {
		isSupported: (desiredLang: string) => boolean;
		getCode: (desiredLang: string) => string | boolean;
	};
}

interface Response {
	text: string;
	from: {
		language: { didYouMean: boolean; iso: string };
		text: { autoCorrect: boolean; value: string; didYouMean: string };
	};
	raw: string;
}