import MenuItem from '@mui/material/MenuItem';
import TextField from '@mui/material/TextField';
import {
	type Control,
	Controller,
	type FieldPath,
	type FieldValues,
} from 'react-hook-form';
import type { SelectOption } from '../form/useVehicleForm.ts';

interface SelectFieldProps<
	TFieldValues extends FieldValues,
	TTransformedValues,
> {
	control: Control<TFieldValues, unknown, TTransformedValues>;
	name: FieldPath<TFieldValues>;
	label: string;
	options: readonly SelectOption[];
	onValueChange?: (value: string) => void;
	disabled?: boolean;
}

function SelectField<TFieldValues extends FieldValues, TTransformedValues>({
	control,
	name,
	label,
	options,
	onValueChange,
	disabled = false,
}: SelectFieldProps<TFieldValues, TTransformedValues>) {
	return (
		<Controller
			control={control}
			name={name}
			render={({ field, fieldState }) => (
				<TextField
					select
					fullWidth
					label={label}
					{...field}
					disabled={disabled}
					value={field.value ?? ''}
					onChange={(event) =>
						(onValueChange ?? field.onChange)(event.target.value)
					}
					error={fieldState.invalid}
					helperText={fieldState.error?.message}
					slotProps={{
						select: { displayEmpty: true },
						inputLabel: { shrink: true },
					}}
				>
					<MenuItem value="">
						<em>Select a {label.toLowerCase()}…</em>
					</MenuItem>
					{options.map((option) => (
						<MenuItem key={option.value} value={option.value}>
							{option.label}
						</MenuItem>
					))}
				</TextField>
			)}
		/>
	);
}

export default SelectField;
