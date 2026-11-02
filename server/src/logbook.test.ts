import { HttpStatus } from '@autograb/shared';
import { describe, expect, it } from 'vitest';
import { readLogbook } from './logbook.ts';

function fileWith(contents: Buffer | string) {
	return { originalname: 'logbook.txt', buffer: Buffer.from(contents) };
}

describe('readLogbook', () => {
	it('returns the filename and contents', () => {
		expect(readLogbook(fileWith('Service at 10,000 km'))).toEqual({
			ok: true,
			logbook: { filename: 'logbook.txt', contents: 'Service at 10,000 km' },
		});
	});

	it('strips a UTF-8 BOM and converts CRLF to LF', () => {
		const result = readLogbook(fileWith('﻿line 1\r\nline 2\r\n'));

		expect(result).toMatchObject({
			ok: true,
			logbook: { contents: 'line 1\nline 2\n' },
		});
	});

	it('rejects an empty file as a bad request', () => {
		expect(readLogbook(fileWith(''))).toEqual({
			ok: false,
			status: HttpStatus.BAD_REQUEST,
			error: {
				error: { message: 'The logbook file is empty', field: 'logbook' },
			},
		});
	});

	it.each([
		['invalid UTF-8', Buffer.from([0x89, 0x50, 0x4e, 0x47, 0xff])],
		['NUL bytes', Buffer.from('text\0more')],
	])('rejects %s as unsupported media', (_case, buffer) => {
		expect(readLogbook(fileWith(buffer))).toEqual({
			ok: false,
			status: HttpStatus.UNSUPPORTED_MEDIA_TYPE,
			error: {
				error: {
					message: 'The logbook must be a plain text file',
					field: 'logbook',
				},
			},
		});
	});
});
