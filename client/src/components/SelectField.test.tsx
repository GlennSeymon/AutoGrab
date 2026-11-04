import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { useForm, useWatch } from 'react-hook-form';
import { describe, expect, it } from 'vitest';
import SelectField from './SelectField.tsx';

const OPTIONS = [
	{ value: 'ford', label: 'Ford' },
	{ value: 'bmw', label: 'BMW' },
];

function TestForm() {
	const { control, setValue } = useForm({ defaultValues: { make: '' } });
	const make = useWatch({ control, name: 'make' });

	return (
		<>
			<SelectField
				control={control}
				name="make"
				label="Make"
				options={OPTIONS}
				onValueChange={(value) => setValue('make', value)}
			/>
			<output>{make}</output>
		</>
	);
}

describe('SelectField', () => {
	it('selects an option with the keyboard', async () => {
		const user = userEvent.setup();
		render(<TestForm />);

		await user.tab();
		await user.keyboard('{Enter}{ArrowDown}{ArrowDown}{Enter}');

		expect(screen.getByRole('status')).toHaveTextContent('bmw');
		expect(screen.getByRole('combobox', { name: 'Make' })).toHaveTextContent(
			'BMW',
		);
	});
});
