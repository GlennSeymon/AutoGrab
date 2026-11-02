import { UPLOAD_PATH } from '@autograb/shared';
import request from 'supertest';
import { describe, expect, it } from 'vitest';
import { createApp } from './app.ts';

describe(`POST ${UPLOAD_PATH} validation`, () => {
	it('rejects a request with no form fields', async () => {
		const response = await request(createApp()).post(UPLOAD_PATH);

		expect(response.status).toBe(400);
		expect(response.body).toEqual({
			error: { message: 'Select a make', field: 'make' },
		});
	});

	it('rejects a missing field', async () => {
		const response = await request(createApp())
			.post(UPLOAD_PATH)
			.field('make', 'ford')
			.field('badge', 'Raptor');

		expect(response.status).toBe(400);
		expect(response.body).toEqual({
			error: { message: 'Select a model', field: 'model' },
		});
	});

	it('rejects a badge from another model', async () => {
		const response = await request(createApp())
			.post(UPLOAD_PATH)
			.field('make', 'ford')
			.field('model', 'Falcon Ute')
			.field('badge', 'XR8');

		expect(response.status).toBe(400);
		expect(response.body).toEqual({
			error: { message: 'Select a valid badge for this model', field: 'badge' },
		});
	});
});
