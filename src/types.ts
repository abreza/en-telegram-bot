export interface Env {
	TELEGRAM_BOT_TOKEN: string;
	TELEGRAM_CHAT_ID: string;
	OPENAI_API_KEY: string;
	EN_BOT: KVNamespace;
}

export type Quiz = [string, string[], number, string];

export type ReadingQuestion = {
	passage: string;
	questions: Quiz[];
};
