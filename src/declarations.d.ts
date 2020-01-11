interface TranslateOptions { from?: string; to?: string; raw?: boolean }

declare module '@vitalets/google-translate-api' {
	export default function translate(text: string, options?: TranslateOptions): Promise<Response>;
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