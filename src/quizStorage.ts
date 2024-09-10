import { Env, Quiz } from './types';

export async function getPastQuizzes(env: Env): Promise<Quiz[]> {
	try {
		const storedQuizzes = await env.EN_BOT.get('past_quizzes');
		return storedQuizzes ? JSON.parse(storedQuizzes) : [];
	} catch (error) {
		console.error(`Error getting past quizzes: ${error instanceof Error ? error.message : String(error)}`);
		return [];
	}
}

export async function storeQuizzes(newQuizzes: Quiz[], env: Env): Promise<void> {
	try {
		const pastQuizzes = await getPastQuizzes(env);
		const updatedQuizzes = [...pastQuizzes, ...newQuizzes].slice(-1000); // Keep last 1000 quizzes
		await env.EN_BOT.put('past_quizzes', JSON.stringify(updatedQuizzes));
	} catch (error) {
		console.error(`Error storing quizzes: ${error instanceof Error ? error.message : String(error)}`);
	}
}

export async function getTriggerCount(env: Env): Promise<number> {
	const count = await env.EN_BOT.get('trigger_count');
	return count ? parseInt(count, 10) : 0;
}

export async function incrementTriggerCount(env: Env): Promise<void> {
	const count = await getTriggerCount(env);
	await env.EN_BOT.put('trigger_count', (count + 1).toString());
}
