import Button from '@mui/material/Button';
import FormHelperText from '@mui/material/FormHelperText';
import Stack from '@mui/material/Stack';
import { styled } from '@mui/material/styles';
import Typography from '@mui/material/Typography';
import { useId } from 'react';
import {
	type Control,
	Controller,
	type FieldPath,
	type FieldValues,
} from 'react-hook-form';

const HiddenFileInput = styled('input')({
	clip: 'rect(0 0 0 0)',
	clipPath: 'inset(50%)',
	height: 1,
	overflow: 'hidden',
	position: 'absolute',
	bottom: 0,
	left: 0,
	whiteSpace: 'nowrap',
	width: 1,
});

interface LogbookInputProps<
	TFieldValues extends FieldValues,
	TTransformedValues,
> {
	control: Control<TFieldValues, unknown, TTransformedValues>;
	name: FieldPath<TFieldValues>;
	label: string;
	inputKey: number;
	onRemove: () => void;
	disabled?: boolean;
}

function LogbookInput<TFieldValues extends FieldValues, TTransformedValues>({
	control,
	name,
	label,
	inputKey,
	onRemove,
	disabled = false,
}: LogbookInputProps<TFieldValues, TTransformedValues>) {
	const errorId = useId();

	return (
		<Controller
			control={control}
			name={name}
			render={({ field, fieldState }) => {
				const file: unknown = field.value;
				return (
					<Stack spacing={1}>
						<Stack
							direction="row"
							spacing={2}
							useFlexGap
							sx={{ alignItems: 'center', flexWrap: 'wrap' }}
						>
							<Button component="label" variant="outlined" disabled={disabled}>
								{label}
								<HiddenFileInput
									key={inputKey}
									type="file"
									accept=".txt,text/plain"
									name={field.name}
									ref={field.ref}
									onBlur={field.onBlur}
									disabled={disabled}
									aria-invalid={fieldState.invalid}
									aria-describedby={fieldState.error ? errorId : undefined}
									onChange={(event) => field.onChange(event.target.files?.[0])}
								/>
							</Button>
							{file instanceof File && (
								<>
									<Typography sx={{ overflowWrap: 'anywhere' }}>
										{file.name}
									</Typography>
									<Button
										variant="text"
										aria-label={`Remove ${file.name}`}
										onClick={onRemove}
										disabled={disabled}
									>
										Remove
									</Button>
								</>
							)}
						</Stack>
						{fieldState.error && (
							<FormHelperText id={errorId} error>
								{fieldState.error.message}
							</FormHelperText>
						)}
					</Stack>
				);
			}}
		/>
	);
}

export default LogbookInput;
