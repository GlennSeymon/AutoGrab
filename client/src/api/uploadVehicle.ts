import {
	type ApiError,
	apiErrorSchema,
	HttpStatus,
	LOGBOOK_FIELD,
	UPLOAD_PATH,
	type UploadResponse,
	uploadResponseSchema,
	type VehicleSelection,
} from '@autograb/shared';
import axios from 'axios';

export interface UploadVehicleInput extends VehicleSelection {
	logbook?: File;
}

export type UploadError = ApiError['error'];

export type UploadVehicleResult =
	{ ok: true; data: UploadResponse } | { ok: false; error: UploadError };

export const NETWORK_ERROR_MESSAGE =
	"Can't reach the server. Check your connection and try again.";
export const UNEXPECTED_RESPONSE_MESSAGE =
	'Unexpected response from the server. Please try again.';

const GATEWAY_ERROR_STATUSES = new Set<number>([
	HttpStatus.BAD_GATEWAY,
	HttpStatus.SERVICE_UNAVAILABLE,
	HttpStatus.GATEWAY_TIMEOUT,
]);

function failure(message: string): UploadVehicleResult {
	return { ok: false, error: { message } };
}

function toFormData({ make, model, badge, logbook }: UploadVehicleInput) {
	const formData = new FormData();
	formData.append('make', make);
	formData.append('model', model);
	formData.append('badge', badge);
	if (logbook) {
		formData.append(LOGBOOK_FIELD, logbook);
	}
	return formData;
}

export async function uploadVehicle(
	input: UploadVehicleInput,
): Promise<UploadVehicleResult> {
	try {
		const response = await axios.post<unknown>(UPLOAD_PATH, toFormData(input));
		const result = uploadResponseSchema.safeParse(response.data);
		return result.success
			? { ok: true, data: result.data }
			: failure(UNEXPECTED_RESPONSE_MESSAGE);
	} catch (error) {
		if (!axios.isAxiosError<unknown>(error) || !error.response) {
			return failure(NETWORK_ERROR_MESSAGE);
		}
		const result = apiErrorSchema.safeParse(error.response.data);
		if (result.success) {
			return { ok: false, error: result.data.error };
		}
		return GATEWAY_ERROR_STATUSES.has(error.response.status)
			? failure(NETWORK_ERROR_MESSAGE)
			: failure(UNEXPECTED_RESPONSE_MESSAGE);
	}
}
