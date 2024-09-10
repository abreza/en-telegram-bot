import { Env, Quiz, ListeningQuestion } from './types';

export async function sendQuizzes(quizzes: Quiz[], env: Env): Promise<void> {
	for (const [question, options, correctOptionId, solution] of quizzes) {
		try {
			const response = await fetch(`https://api.telegram.org/bot${env.TELEGRAM_BOT_TOKEN}/sendPoll`, {
				method: 'POST',
				headers: {
					'Content-Type': 'application/json',
				},
				body: JSON.stringify({
					chat_id: env.TELEGRAM_CHAT_ID,
					question: question,
					options: options,
					type: 'quiz',
					correct_option_id: correctOptionId,
					is_anonymous: true,
					explanation: solution,
				}),
			});

			if (!response.ok) {
				throw new Error(`HTTP error! status: ${response.status}`);
			}
		} catch (error) {
			console.error(`Error sending quiz: ${error instanceof Error ? error.message : String(error)}`);
		}
	}
}

export async function sendListeningQuestion(listeningQuestion: ListeningQuestion, env: Env): Promise<void> {
	try {
		// Send the story
		await fetch(`https://api.telegram.org/bot${env.TELEGRAM_BOT_TOKEN}/sendMessage`, {
			method: 'POST',
			headers: {
				'Content-Type': 'application/json',
			},
			body: JSON.stringify({
				chat_id: env.TELEGRAM_CHAT_ID,
				text: `Listening Comprehension Story:\n\n${listeningQuestion.story}`,
			}),
		});

		// Send the questions
		await sendQuizzes(listeningQuestion.questions, env);
	} catch (error) {
		console.error(`Error sending listening question: ${error instanceof Error ? error.message : String(error)}`);
	}
}
