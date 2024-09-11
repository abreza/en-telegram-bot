import { generateObject } from 'ai';
import { createOpenAI } from '@ai-sdk/openai';
import { z } from 'zod';
import { Quiz, ReadingQuestion } from './types';

const quizSchema = z.object({
	quizzes: z
		.array(
			z.object({
				question: z.string(),
				options: z
					.array(
						z.object({
							text: z.string(),
							is_correct: z.boolean(),
						})
					)
					.length(4),
				solution: z.string(),
			})
		)
		.length(10),
});

const readingQuestionSchema = z.object({
	passage: z.string(),
	questions: z
		.array(
			z.object({
				question: z.string(),
				options: z
					.array(
						z.object({
							text: z.string(),
							is_correct: z.boolean(),
						})
					)
					.length(4),
				solution: z.string(),
			})
		)
		.length(5),
});

export async function generateStructuredQuizzes(pastQuizzes: Quiz[], env: { OPENAI_API_KEY: string }): Promise<Quiz[]> {
	try {
		const openai = createOpenAI({ apiKey: env.OPENAI_API_KEY });
		const { object } = await generateObject({
			model: openai('gpt-4o-mini-2024-07-18'),
			schema: quizSchema,
			schemaName: 'EnglishQuizSet',
			schemaDescription: 'A set of English language quizzes for intermediate learners',
			prompt: `Generate 10 unique English quiz questions about vocabulary, grammar, idioms, or everyday phrases.
                     Include 5 basic questions and 5 intermediate questions.
                     Each question should have 4 options in English, with one correct answer.
                     Provide a solution explanation for each question in Persian.
                     Ensure diversity in topics and question types.
                     Avoid generating questions that are identical or very similar to these past questions: ${JSON.stringify(pastQuizzes)}`,
			temperature: 1.2,
		});

		return object.quizzes.map((quiz) => [
			quiz.question,
			quiz.options.map((option) => option.text),
			quiz.options.findIndex((option) => option.is_correct),
			quiz.solution,
		]);
	} catch (error) {
		if (error instanceof z.ZodError) {
			console.error('Validation error:', error.errors);
		} else {
			console.error('Error generating quizzes:', error);
		}
		throw error;
	}
}

export async function generateReadingQuestion(env: { OPENAI_API_KEY: string }): Promise<ReadingQuestion> {
	try {
		const openai = createOpenAI({ apiKey: env.OPENAI_API_KEY });
		const { object } = await generateObject({
			model: openai('gpt-4o-mini-2024-07-18'),
			schema: readingQuestionSchema,
			schemaName: 'ReadingQuestionSet',
			schemaDescription: 'A reading comprehension question set with a passage and related questions',
			prompt: `Generate a unique short passage (about 150-200 words) suitable for intermediate English learners.
                     The passage should cover an interesting topic.
                     Then, create 5 diverse comprehension questions about the passage.
                     Each question should have 4 options in English, with one correct answer.
                     Ensure the questions test different aspects of comprehension (main idea, details, inference, vocabulary, etc.).
                     Provide a solution explanation for each question in Persian.`,
			temperature: 1.2,
		});

		return {
			passage: object.passage,
			questions: object.questions.map((quiz) => [
				quiz.question,
				quiz.options.map((option) => option.text),
				quiz.options.findIndex((option) => option.is_correct),
				quiz.solution,
			]),
		};
	} catch (error) {
		if (error instanceof z.ZodError) {
			console.error('Validation error:', error.errors);
		} else {
			console.error('Error generating reading question:', error);
		}
		throw error;
	}
}
