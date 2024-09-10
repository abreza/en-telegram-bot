import { Env } from './types';
import { generateStructuredQuizzes } from './structuredQuizGenerator';
import { getPastQuizzes, storeQuizzes } from './quizStorage';
import { sendQuizzes } from './telegramService';

export async function scheduledQuizzes(env: Env): Promise<void> {
	try {
		const pastQuizzes = await getPastQuizzes(env);
		const quizzes = await generateStructuredQuizzes(pastQuizzes, env);
		await sendQuizzes(quizzes, env);
		await storeQuizzes(quizzes, env);
		console.log('Quizzes sent and stored successfully');
	} catch (error) {
		console.error(`An error occurred: ${error instanceof Error ? error.message : String(error)}`);
	}
}
