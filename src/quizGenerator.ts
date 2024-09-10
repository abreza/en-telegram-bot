import { Env } from './types';
import { generateStructuredQuizzes, generateListeningQuestion } from './structuredQuizGenerator';
import { getPastQuizzes, storeQuizzes, getTriggerCount, incrementTriggerCount } from './quizStorage';
import { sendQuizzes, sendListeningQuestion } from './telegramService';

export async function scheduledQuizzes(env: Env): Promise<void> {
	try {
		const triggerCount = await getTriggerCount(env);
		const isListeningQuestionTurn = triggerCount % 3 === 0;

		const pastQuizzes = await getPastQuizzes(env);

		if (isListeningQuestionTurn) {
			const listeningQuestion = await generateListeningQuestion(env);
			await sendListeningQuestion(listeningQuestion, env);
			await storeQuizzes(listeningQuestion.questions, env);
		} else {
			const quizzes = await generateStructuredQuizzes(pastQuizzes, env);
			await sendQuizzes(quizzes, env);
			await storeQuizzes(quizzes, env);
		}

		await incrementTriggerCount(env);
		console.log(`${isListeningQuestionTurn ? 'Listening question' : 'Quizzes'} sent and stored successfully`);
	} catch (error) {
		console.error(`An error occurred: ${error instanceof Error ? error.message : String(error)}`);
	}
}
