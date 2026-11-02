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

describe(`POST ${UPLOAD_PATH}`, () => {
	const selection = { make: 'tesla', model: 'Model 3', badge: 'Performance' };

	function postSelection() {
		return request(createApp())
			.post(UPLOAD_PATH)
			.field('make', selection.make)
			.field('model', selection.model)
			.field('badge', selection.badge);
	}

	it('returns the selection and logbook', async () => {
		const response = await postSelection().attach(
			'logbook',
			Buffer.from('line 1\r\nline 2'),
			'logbook.txt',
		);

		expect(response.status).toBe(200);
		expect(response.body).toEqual({
			...selection,
			logbook: { filename: 'logbook.txt', contents: 'line 1\nline 2' },
		});
	});

	it('returns a null logbook when no file is sent', async () => {
		const response = await postSelection();

		expect(response.status).toBe(200);
		expect(response.body).toEqual({ ...selection, logbook: null });
	});

	it('rejects an empty logbook with 400', async () => {
		const response = await postSelection().attach(
			'logbook',
			Buffer.alloc(0),
			'logbook.txt',
		);

		expect(response.status).toBe(400);
		expect(response.body).toEqual({
			error: { message: 'The logbook file is empty', field: 'logbook' },
		});
	});

	it('rejects a binary logbook with 415', async () => {
		const response = await postSelection().attach(
			'logbook',
			Buffer.from([0x89, 0x50, 0x4e, 0x47, 0x00, 0xff]),
			'logbook.txt',
		);

		expect(response.status).toBe(415);
		expect(response.body).toEqual({
			error: {
				message: 'The logbook must be a plain text file',
				field: 'logbook',
			},
		});
	});
});
