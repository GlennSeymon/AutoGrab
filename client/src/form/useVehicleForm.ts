import {
	formatMake,
	getBadges,
	getMakes,
	getModels,
	type VehicleSelection,
	vehicleSelectionSchema,
} from '@autograb/shared';
import { zodResolver } from '@hookform/resolvers/zod';
import { useState } from 'react';
import { useForm, useWatch } from 'react-hook-form';
import {
	EMPTY_FORM_VALUES,
	nextFormValues,
	type SelectionField,
	vehicleFormSchema,
	type VehicleFormValues,
} from './vehicleForm.ts';

export interface SelectOption {
	value: string;
	label: string;
}

function toOptions(
	values: readonly string[],
	format: (value: string) => string = (value) => value,
): SelectOption[] {
	return values.map((value) => ({ value, label: format(value) }));
}

export function useVehicleForm() {
	const form = useForm({
		resolver: zodResolver(vehicleFormSchema),
		mode: 'onChange',
		defaultValues: EMPTY_FORM_VALUES,
	});
	const { control, getValues, reset, setValue } = form;
	const [make, model, badge] = useWatch({
		control,
		name: ['make', 'model', 'badge'],
	});
	const [logbookInputKey, setLogbookInputKey] = useState(0);

	function resetLogbookInput() {
		setLogbookInputKey((key) => key + 1);
	}

	function resetTo(values: VehicleFormValues) {
		reset(values);
		resetLogbookInput();
	}

	return {
		form,
		selection: { make, model, badge },
		makeOptions: toOptions(getMakes(), formatMake),
		modelOptions: toOptions(getModels(make)),
		badgeOptions: toOptions(getBadges(make, model)),
		showModel: make !== '',
		showBadge: model !== '',
		isSelectionComplete: vehicleSelectionSchema.safeParse({
			make,
			model,
			badge,
		}).success,
		logbookInputKey,
		selectField: (field: SelectionField, value: string) =>
			resetTo(nextFormValues(getValues(), field, value)),
		quickSelect: (selection: VehicleSelection) =>
			resetTo({ ...EMPTY_FORM_VALUES, ...selection }),
		clear: () => resetTo(EMPTY_FORM_VALUES),
		removeLogbook: () => {
			setValue('logbook', undefined, { shouldValidate: true });
			resetLogbookInput();
		},
	};
}
