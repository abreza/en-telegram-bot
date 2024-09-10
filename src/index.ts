import { Env } from './types';
import { scheduledQuizzes } from './quizGenerator';

export default {
	async scheduled(event: ScheduledEvent, env: Env, ctx: ExecutionContext): Promise<void> {
		ctx.waitUntil(scheduledQuizzes(env));
		console.log(`Cron trigger "${event.cron}" ran at ${new Date(event.scheduledTime).toUTCString()}`);
	},

	async fetch(): Promise<Response> {
		return new Response('Quiz bot is running. Quizzes are sent on a schedule.', { status: 200 });
	},
};
