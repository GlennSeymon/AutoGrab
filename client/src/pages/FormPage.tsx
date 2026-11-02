import Alert from '@mui/material/Alert';
import Button from '@mui/material/Button';
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';
import type { FormEvent } from 'react';
import { useNavigate } from 'react-router';
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
	const navigate = useNavigate();
	const { isSubmitting, errors } = form.formState;

	const submit = form.handleSubmit(async (values) => {
		const result = await uploadVehicle(values);
		if (result.ok) {
			navigate('/upload', { state: result.data });
			return;
		}
		const { message, field } = result.error;
		if (field) {
			form.setError(field, { type: 'server', message });
			form.setFocus(field);
		} else {
			form.setError('root.server', { type: 'server', message });
		}
	});

	function onSubmit(event: FormEvent<HTMLFormElement>) {
		form.clearErrors('root.server');
		return submit(event);
	}

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
			{errors.root?.server && (
				<Alert severity="error">{errors.root.server.message}</Alert>
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
