import { Env } from './types';
import { generateStructuredQuizzes, generateReadingQuestion } from './structuredQuizGenerator';
import { getPastQuizzes, storeQuizzes, getTriggerCount, incrementTriggerCount } from './quizStorage';
import { sendQuizzes, sendReadingQuestion } from './telegramService';

export async function scheduledQuizzes(env: Env): Promise<void> {
	try {
		const triggerCount = await getTriggerCount(env);
		const isReadingQuestionTurn = triggerCount % 3 === 0;

		const pastQuizzes = await getPastQuizzes(env);

		if (isReadingQuestionTurn) {
			const readingQuestion = await generateReadingQuestion(env);
			await sendReadingQuestion(readingQuestion, env);
			await storeQuizzes(readingQuestion.questions, env);
		} else {
			const quizzes = await generateStructuredQuizzes(pastQuizzes, env);
			await sendQuizzes(quizzes, env);
			await storeQuizzes(quizzes, env);
		}

		await incrementTriggerCount(env);
		console.log(`${isReadingQuestionTurn ? 'Reading question' : 'Quizzes'} sent and stored successfully`);
	} catch (error) {
		console.error(`An error occurred: ${error instanceof Error ? error.message : String(error)}`);
	}
}
