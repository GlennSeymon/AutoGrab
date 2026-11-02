import Button from '@mui/material/Button';
import Stack from '@mui/material/Stack';
import { styled } from '@mui/material/styles';
import Typography from '@mui/material/Typography';
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
}

function LogbookInput<TFieldValues extends FieldValues, TTransformedValues>({
	control,
	name,
	label,
	inputKey,
	onRemove,
}: LogbookInputProps<TFieldValues, TTransformedValues>) {
	return (
		<Controller
			control={control}
			name={name}
			render={({ field }) => {
				const file: unknown = field.value;
				return (
					<Stack
						direction="row"
						spacing={2}
						useFlexGap
						sx={{ alignItems: 'center', flexWrap: 'wrap' }}
					>
						<Button component="label" variant="outlined">
							{label}
							<HiddenFileInput
								key={inputKey}
								type="file"
								accept=".txt,text/plain"
								name={field.name}
								ref={field.ref}
								onBlur={field.onBlur}
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
								>
									Remove
								</Button>
							</>
						)}
					</Stack>
				);
			}}
		/>
	);
}

export default LogbookInput;
