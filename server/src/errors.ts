import {
	type ApiError,
	HttpStatus,
	LOGBOOK_FIELD,
	UPLOAD_FIELDS,
} from '@autograb/shared';
import type { NextFunction, Request, Response } from 'express';
import { MulterError } from 'multer';

function multerErrorBody(error: MulterError): ApiError {
	const field = UPLOAD_FIELDS.find((name) => name === error.field);
	if (error.code === 'LIMIT_FILE_SIZE') {
		return { error: { message: 'The logbook must be 1 MB or smaller', field } };
	}
	if (error.code === 'LIMIT_UNEXPECTED_FILE') {
		return {
			error: { message: `Send the logbook in the "${LOGBOOK_FIELD}" field` },
		};
	}
	return { error: { message: error.message, field } };
}

export function handleNotFound(_req: Request, res: Response<ApiError>) {
	res.status(HttpStatus.NOT_FOUND).json({ error: { message: 'Not found' } });
}

export function handleErrors(
	error: unknown,
	_req: Request,
	res: Response<ApiError>,
	next: NextFunction,
) {
	if (res.headersSent) {
		next(error);
		return;
	}
	if (error instanceof MulterError) {
		const status =
			error.code === 'LIMIT_FILE_SIZE'
				? HttpStatus.PAYLOAD_TOO_LARGE
				: HttpStatus.BAD_REQUEST;
		res.status(status).json(multerErrorBody(error));
		return;
	}
	console.error(error);
	res
		.status(HttpStatus.INTERNAL_SERVER_ERROR)
		.json({ error: { message: 'Something went wrong on the server' } });
}
