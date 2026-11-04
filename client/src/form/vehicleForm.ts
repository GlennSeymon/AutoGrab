import {
	LOGBOOK_EMPTY_MESSAGE,
	LOGBOOK_MAX_BYTES,
	LOGBOOK_TOO_LARGE_MESSAGE,
	vehicleSelectionSchema,
} from '@autograb/shared';
import { z } from 'zod';

export const vehicleFormSchema = vehicleSelectionSchema.safeExtend({
	logbook: z
		.file()
		.min(1, { error: LOGBOOK_EMPTY_MESSAGE })
		.max(LOGBOOK_MAX_BYTES, { error: LOGBOOK_TOO_LARGE_MESSAGE })
		.optional(),
});

export type VehicleFormValues = z.input<typeof vehicleFormSchema>;

export type SelectionField = 'make' | 'model' | 'badge';

export const EMPTY_FORM_VALUES: VehicleFormValues = {
	make: '',
	model: '',
	badge: '',
	logbook: undefined,
};

export function nextFormValues(
	values: VehicleFormValues,
	field: SelectionField,
	value: string,
): VehicleFormValues {
	switch (field) {
		case 'make':
			return { ...EMPTY_FORM_VALUES, make: value };
		case 'model':
			return { ...values, model: value, badge: '', logbook: undefined };
		case 'badge':
			return { ...values, badge: value, logbook: undefined };
	}
}
