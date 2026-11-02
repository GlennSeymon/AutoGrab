import { describe, expect, it } from 'vitest';
import { apiErrorSchema, uploadResponseSchema } from './api.ts';

describe('uploadResponseSchema', () => {
	const vehicle = { make: 'tesla', model: 'Model 3', badge: 'Performance' };

	it.each([
		['with a logbook', { filename: 'logbook.txt', contents: 'Service\n' }],
		['without a logbook', null],
	])('accepts a response %s', (_, logbook) => {
		expect(
			uploadResponseSchema.safeParse({ ...vehicle, logbook }).success,
		).toBe(true);
	});

	it('rejects a vehicle that is not in the data', () => {
		const response = { ...vehicle, badge: 'XR8', logbook: null };
		expect(uploadResponseSchema.safeParse(response).success).toBe(false);
	});
});

describe('apiErrorSchema', () => {
	it('rejects a field that is not part of the upload form', () => {
		const error = { error: { message: 'Bad', field: 'colour' } };
		expect(apiErrorSchema.safeParse(error).success).toBe(false);
	});
});
