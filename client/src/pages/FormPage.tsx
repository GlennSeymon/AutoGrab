import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';
import SelectField from '../components/SelectField.tsx';
import { useVehicleForm } from '../form/useVehicleForm.ts';

function FormPage() {
	const {
		form,
		makeOptions,
		modelOptions,
		badgeOptions,
		showModel,
		showBadge,
		selectField,
	} = useVehicleForm();

	return (
		<Stack spacing={3}>
			<Typography variant="h5" component="h2">
				Select a vehicle
			</Typography>
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
		</Stack>
	);
}

export default FormPage;
