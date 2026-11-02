import {
	type ApiError,
	HttpStatus,
	LOGBOOK_FIELD,
	type LogbookResult,
} from '@autograb/shared';

export type LogbookFile = Pick<Express.Multer.File, 'originalname' | 'buffer'>;

type FailureStatus =
	typeof HttpStatus.BAD_REQUEST | typeof HttpStatus.UNSUPPORTED_MEDIA_TYPE;

export type ReadLogbookResult =
	| { ok: true; logbook: LogbookResult }
	| { ok: false; status: FailureStatus; error: ApiError };

const decoder = new TextDecoder('utf-8', { fatal: true });

function failure(status: FailureStatus, message: string): ReadLogbookResult {
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
		return failure(HttpStatus.BAD_REQUEST, 'The logbook file is empty');
	}
	const text = decode(file.buffer);
	if (text === null || text.includes('\0')) {
		return failure(
			HttpStatus.UNSUPPORTED_MEDIA_TYPE,
			'The logbook must be a plain text file',
		);
	}
	return {
		ok: true,
		logbook: {
			filename: file.originalname,
			contents: text.replaceAll('\r\n', '\n'),
		},
	};
}
