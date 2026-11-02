import { HttpStatus } from '@autograb/shared';
import request from 'supertest';
import { describe, expect, it } from 'vitest';
import { createApp } from './app.ts';

describe('GET /api/health', () => {
	it('responds with ok', async () => {
		const response = await request(createApp()).get('/api/health');

		expect(response.status).toBe(HttpStatus.OK);
		expect(response.body).toEqual({ status: 'ok' });
	});
});

describe('unknown API routes', () => {
	it('respond with a JSON not found error', async () => {
		const response = await request(createApp()).get('/api/nope');

		expect(response.status).toBe(HttpStatus.NOT_FOUND);
		expect(response.type).toBe('application/json');
		expect(response.body).toEqual({ error: { message: 'Not found' } });
	});
});
