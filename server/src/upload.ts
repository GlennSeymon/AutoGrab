import {
	type ApiError,
	LOGBOOK_FIELD,
	LOGBOOK_MAX_BYTES,
	UPLOAD_FIELDS,
	type VehicleSelection,
	vehicleSelectionSchema,
} from '@autograb/shared';
import type { NextFunction, Request, Response } from 'express';
import multer from 'multer';

export interface UploadLocals {
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
		res.status(400).json({
			error: {
				message: issue.message,
				field: UPLOAD_FIELDS.find((field) => field === issue.path[0]),
			},
		});
		return;
	}
	res.locals.selection = result.data;
	next();
}
