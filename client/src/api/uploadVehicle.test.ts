import { HttpStatus, type UploadResponse, UPLOAD_PATH } from '@autograb/shared';
import axios from 'axios';
import AxiosMockAdapter from 'axios-mock-adapter';
import { afterEach, describe, expect, it } from 'vitest';
import {
	NETWORK_ERROR_MESSAGE,
	UNEXPECTED_RESPONSE_MESSAGE,
	uploadVehicle,
} from './uploadVehicle.ts';

const selection = { make: 'ford', model: 'Ranger', badge: 'Wildtrak' };

const mock = new AxiosMockAdapter(axios);

afterEach(() => {
	mock.reset();
});

describe('uploadVehicle', () => {
	it('posts the selection and logbook as form data and returns the response', async () => {
		const data: UploadResponse = {
			...selection,
			logbook: { filename: 'logbook.txt', contents: 'Serviced' },
		};
		mock.onPost(UPLOAD_PATH).reply(HttpStatus.OK, data);
		const logbook = new File(['Serviced'], 'logbook.txt', {
			type: 'text/plain',
		});

		const result = await uploadVehicle({ ...selection, logbook });

		expect(result).toEqual({ ok: true, data });
		const [request] = mock.history.post;
		expect(request.url).toBe(UPLOAD_PATH);
		const body = request.data as FormData;
		expect(Object.fromEntries(body)).toEqual({
			...selection,
			logbook: expect.any(File),
		});
		expect((body.get('logbook') as File).name).toBe('logbook.txt');
	});

	it('returns the API error message and field', async () => {
		const error = {
			message: 'The logbook file is empty',
			field: 'logbook' as const,
		};
		mock.onPost(UPLOAD_PATH).reply(HttpStatus.BAD_REQUEST, { error });

		expect(await uploadVehicle(selection)).toEqual({ ok: false, error });
	});

	it('returns a network error when the request fails', async () => {
		mock.onPost(UPLOAD_PATH).networkError();

		expect(await uploadVehicle(selection)).toEqual({
			ok: false,
			error: { message: NETWORK_ERROR_MESSAGE },
		});
	});

	it('returns a network error when a proxy cannot reach the server', async () => {
		mock.onPost(UPLOAD_PATH).reply(HttpStatus.BAD_GATEWAY, '');

		expect(await uploadVehicle(selection)).toEqual({
			ok: false,
			error: { message: NETWORK_ERROR_MESSAGE },
		});
	});

	it('returns an unexpected response error for a non-JSON reply', async () => {
		mock
			.onPost(UPLOAD_PATH)
			.reply(HttpStatus.INTERNAL_SERVER_ERROR, '<h1>Bad Gateway</h1>');

		expect(await uploadVehicle(selection)).toEqual({
			ok: false,
			error: { message: UNEXPECTED_RESPONSE_MESSAGE },
		});
	});

	it('returns an unexpected response error for JSON with the wrong shape', async () => {
		mock.onPost(UPLOAD_PATH).reply(HttpStatus.OK, { make: 'ford' });

		expect(await uploadVehicle(selection)).toEqual({
			ok: false,
			error: { message: UNEXPECTED_RESPONSE_MESSAGE },
		});
	});
});
