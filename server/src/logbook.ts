import {
	type ApiError,
	LOGBOOK_FIELD,
	type LogbookResult,
} from '@autograb/shared';

export type LogbookFile = Pick<Express.Multer.File, 'originalname' | 'buffer'>;

export type ReadLogbookResult =
	| { ok: true; logbook: LogbookResult }
	| { ok: false; status: 400 | 415; error: ApiError };

const decoder = new TextDecoder('utf-8', { fatal: true });

function failure(status: 400 | 415, message: string): ReadLogbookResult {
	return {
		ok: false,
		status,
		error: { error: { message, field: LOGBOOK_FIELD } },
	};
}

function decode(buffer: Buffer) {
	try {
		return decoder.decode(buffer);
	} catch {
		return null;
	}
}

export function readLogbook(file: LogbookFile): ReadLogbookResult {
	if (file.buffer.length === 0) {
		return failure(400, 'The logbook file is empty');
	}
	const text = decode(file.buffer);
	if (text === null || text.includes('\0')) {
		return failure(415, 'The logbook must be a plain text file');
	}
	return {
		ok: true,
		logbook: {
			filename: file.originalname,
			contents: text.replaceAll('\r\n', '\n'),
		},
	};
}
