import {
	type ApiError,
	HttpStatus,
	LOGBOOK_FIELD,
	LOGBOOK_MAX_BYTES,
	toUploadField,
	type UploadResponse,
	type VehicleSelection,
	vehicleSelectionSchema,
} from '@autograb/shared';
import type { NextFunction, Request, Response } from 'express';
import multer from 'multer';
import { readLogbook } from './logbook.ts';

interface UploadLocals {
	selection: VehicleSelection;
}

export const parseLogbook = multer({
	storage: multer.memoryStorage(),
	limits: { fileSize: LOGBOOK_MAX_BYTES },
	defParamCharset: 'utf8',
}).single(LOGBOOK_FIELD);

export function validateSelection(
	req: Request<Record<string, string>, ApiError, unknown>,
	res: Response<ApiError, UploadLocals>,
	next: NextFunction,
) {
	const result = vehicleSelectionSchema.safeParse(req.body ?? {});
	if (!result.success) {
		const [issue] = result.error.issues;
		res.status(HttpStatus.BAD_REQUEST).json({
			error: {
				message: issue.message,
				field: toUploadField(issue.path[0]),
			},
		});
		return;
	}
	res.locals.selection = result.data;
	next();
}

export function handleUpload(
	req: Request,
	res: Response<UploadResponse | ApiError, UploadLocals>,
) {
	const { selection } = res.locals;
	if (!req.file) {
		res.json({ ...selection, logbook: null });
		return;
	}
	const result = readLogbook(req.file);
	if (!result.ok) {
		res.status(result.status).json(result.error);
		return;
	}
	res.json({ ...selection, logbook: result.logbook });
}
