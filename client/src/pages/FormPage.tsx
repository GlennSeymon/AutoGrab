import Button from '@mui/material/Button';
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';
import { uploadVehicle } from '../api/uploadVehicle.ts';
import LogbookInput from '../components/LogbookInput.tsx';
import QuickSelectButtons from '../components/QuickSelectButtons.tsx';
import SelectField from '../components/SelectField.tsx';
import { useVehicleForm } from '../form/useVehicleForm.ts';

function FormPage() {
	const {
		form,
		selection,
		makeOptions,
		modelOptions,
		badgeOptions,
		showModel,
		showBadge,
		isSelectionComplete,
		logbookInputKey,
		selectField,
		quickSelect,
		clear,
		removeLogbook,
	} = useVehicleForm();
	const { isSubmitting } = form.formState;

	const onSubmit = form.handleSubmit(async (values) => {
		await uploadVehicle(values);
	});

	return (
		<Stack component="form" spacing={3} noValidate onSubmit={onSubmit}>
			<Typography variant="h5" component="h2">
				Select a vehicle
			</Typography>
			<QuickSelectButtons
				selection={selection}
				onSelect={quickSelect}
				disabled={isSubmitting}
			/>
			<SelectField
				control={form.control}
				name="make"
				label="Make"
				options={makeOptions}
				onValueChange={(value) => selectField('make', value)}
				disabled={isSubmitting}
			/>
			{showModel && (
				<SelectField
					control={form.control}
					name="model"
					label="Model"
					options={modelOptions}
					onValueChange={(value) => selectField('model', value)}
					disabled={isSubmitting}
				/>
			)}
			{showBadge && (
				<SelectField
					control={form.control}
					name="badge"
					label="Badge"
					options={badgeOptions}
					onValueChange={(value) => selectField('badge', value)}
					disabled={isSubmitting}
				/>
			)}
			{isSelectionComplete && (
				<LogbookInput
					control={form.control}
					name="logbook"
					label="Attach logbook"
					inputKey={logbookInputKey}
					onRemove={removeLogbook}
					disabled={isSubmitting}
				/>
			)}
			<Stack direction="row" spacing={2}>
				{isSelectionComplete && (
					<Button type="submit" variant="contained" loading={isSubmitting}>
						Submit
					</Button>
				)}
				<Button variant="text" onClick={clear} disabled={isSubmitting}>
					Clear
				</Button>
			</Stack>
		</Stack>
	);
}

export default FormPage;
