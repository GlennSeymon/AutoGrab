import Button from '@mui/material/Button';
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';
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

	return (
		<Stack spacing={3}>
			<Typography variant="h5" component="h2">
				Select a vehicle
			</Typography>
			<QuickSelectButtons selection={selection} onSelect={quickSelect} />
			<SelectField
				control={form.control}
				name="make"
				label="Make"
				options={makeOptions}
				onValueChange={(value) => selectField('make', value)}
			/>
			{showModel && (
				<SelectField
					control={form.control}
					name="model"
					label="Model"
					options={modelOptions}
					onValueChange={(value) => selectField('model', value)}
				/>
			)}
			{showBadge && (
				<SelectField
					control={form.control}
					name="badge"
					label="Badge"
					options={badgeOptions}
					onValueChange={(value) => selectField('badge', value)}
				/>
			)}
			{isSelectionComplete && (
				<LogbookInput
					control={form.control}
					name="logbook"
					label="Attach logbook"
					inputKey={logbookInputKey}
					onRemove={removeLogbook}
				/>
			)}
			<Stack direction="row" spacing={2}>
				{isSelectionComplete && (
					<Button type="submit" variant="contained">
						Submit
					</Button>
				)}
				<Button variant="text" onClick={clear}>
					Clear
				</Button>
			</Stack>
		</Stack>
	);
}

export default FormPage;
