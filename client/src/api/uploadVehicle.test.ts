import { HttpStatus, type UploadResponse, UPLOAD_PATH } from '@autograb/shared';
import { afterEach, describe, expect, it, vi } from 'vitest';
import {
	NETWORK_ERROR_MESSAGE,
	UNEXPECTED_RESPONSE_MESSAGE,
	uploadVehicle,
} from './uploadVehicle.ts';

const selection = { make: 'ford', model: 'Ranger', badge: 'Wildtrak' };

function mockFetch(implementation: () => Promise<Response>) {
	const fetchMock = vi.fn<typeof fetch>(implementation);
	vi.stubGlobal('fetch', fetchMock);
	return fetchMock;
}

afterEach(() => {
	vi.unstubAllGlobals();
});

describe('uploadVehicle', () => {
	it('posts the selection and logbook as form data and returns the response', async () => {
		const data: UploadResponse = {
			...selection,
			logbook: { filename: 'logbook.txt', contents: 'Serviced' },
		};
		const fetchMock = mockFetch(async () => Response.json(data));
		const logbook = new File(['Serviced'], 'logbook.txt', {
			type: 'text/plain',
		});

		const result = await uploadVehicle({ ...selection, logbook });

		expect(result).toEqual({ ok: true, data });
		const [url, init] = fetchMock.mock.calls[0];
		expect(url).toBe(UPLOAD_PATH);
		expect(init?.method).toBe('POST');
		const body = init?.body as FormData;
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
		mockFetch(async () =>
			Response.json({ error }, { status: HttpStatus.BAD_REQUEST }),
		);

		expect(await uploadVehicle(selection)).toEqual({ ok: false, error });
	});

	it('returns a network error when the request fails', async () => {
		mockFetch(async () => {
			throw new TypeError('Failed to fetch');
		});

		expect(await uploadVehicle(selection)).toEqual({
			ok: false,
			error: { message: NETWORK_ERROR_MESSAGE },
		});
	});

	it('returns an unexpected response error for a non-JSON reply', async () => {
		mockFetch(
			async () =>
				new Response('<h1>Bad Gateway</h1>', {
					status: HttpStatus.INTERNAL_SERVER_ERROR,
				}),
		);

		expect(await uploadVehicle(selection)).toEqual({
			ok: false,
			error: { message: UNEXPECTED_RESPONSE_MESSAGE },
		});
	});

	it('returns an unexpected response error for JSON with the wrong shape', async () => {
		mockFetch(async () => Response.json({ make: 'ford' }));

		expect(await uploadVehicle(selection)).toEqual({
			ok: false,
			error: { message: UNEXPECTED_RESPONSE_MESSAGE },
		});
	});
});
