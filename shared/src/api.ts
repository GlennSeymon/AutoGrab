import { z } from 'zod';
import { vehicleSelectionSchema } from './vehicleSelection.ts';

export const UPLOAD_PATH = '/api/upload';
export const LOGBOOK_FIELD = 'logbook';
export const UPLOAD_FIELDS = ['make', 'model', 'badge', LOGBOOK_FIELD] as const;
export const LOGBOOK_MAX_BYTES = 1024 * 1024;
export const LOGBOOK_EMPTY_MESSAGE = 'The logbook file is empty';
export const LOGBOOK_TOO_LARGE_MESSAGE = 'The logbook must be 1 MB or smaller';

export type UploadField = (typeof UPLOAD_FIELDS)[number];

export function toUploadField(value: unknown): UploadField | undefined {
	return UPLOAD_FIELDS.find((field) => field === value);
}

export const logbookResultSchema = z.object({
	filename: z.string(),
	contents: z.string(),
});

export const uploadResponseSchema = vehicleSelectionSchema.safeExtend({
	logbook: logbookResultSchema.nullable(),
});

export const apiErrorSchema = z.object({
	error: z.object({
		message: z.string(),
		field: z.enum(UPLOAD_FIELDS).optional(),
	}),
});

export type LogbookResult = z.infer<typeof logbookResultSchema>;
export type UploadResponse = z.infer<typeof uploadResponseSchema>;
export type ApiError = z.infer<typeof apiErrorSchema>;
