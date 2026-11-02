import {
	type ApiError,
	apiErrorSchema,
	LOGBOOK_FIELD,
	UPLOAD_PATH,
	type UploadResponse,
	uploadResponseSchema,
	type VehicleSelection,
} from '@autograb/shared';

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

async function readJson(response: Response): Promise<unknown> {
	try {
		return await response.json();
	} catch {
		return undefined;
	}
}

export async function uploadVehicle(
	input: UploadVehicleInput,
): Promise<UploadVehicleResult> {
	let response: Response;
	try {
		response = await fetch(UPLOAD_PATH, {
			method: 'POST',
			body: toFormData(input),
		});
	} catch {
		return failure(NETWORK_ERROR_MESSAGE);
	}

	const body = await readJson(response);
	if (response.ok) {
		const result = uploadResponseSchema.safeParse(body);
		return result.success
			? { ok: true, data: result.data }
			: failure(UNEXPECTED_RESPONSE_MESSAGE);
	}
	const result = apiErrorSchema.safeParse(body);
	return result.success
		? { ok: false, error: result.data.error }
		: failure(UNEXPECTED_RESPONSE_MESSAGE);
}
