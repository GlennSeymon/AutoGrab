import { z } from 'zod';

export const envSchema = z.object({
	PORT: z.coerce.number().int().positive().default(3001),
});

export type Env = z.infer<typeof envSchema>;

export function parseEnv(source: NodeJS.ProcessEnv): Env {
	const result = envSchema.safeParse(source);
	if (!result.success) {
		throw new Error(
			`Invalid environment variables:\n${z.prettifyError(result.error)}`,
		);
	}
	return result.data;
}
