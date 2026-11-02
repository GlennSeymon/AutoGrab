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
	const { control } = useForm({ defaultValues: { make: '' } });
	const make = useWatch({ control, name: 'make' });

	return (
		<>
			<SelectField
				control={control}
				name="make"
				label="Make"
				options={OPTIONS}
			/>
			<output>{make}</output>
		</>
	);
}

describe('SelectField', () => {
	it('is found by its label and shows the placeholder', () => {
		render(<TestForm />);

		expect(screen.getByRole('combobox', { name: 'Make' })).toHaveTextContent(
			'Select a make…',
		);
	});

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

	it('clears the value when the placeholder is chosen', async () => {
		const user = userEvent.setup();
		render(<TestForm />);
		const select = screen.getByRole('combobox', { name: 'Make' });

		await user.click(select);
		await user.click(screen.getByRole('option', { name: 'Ford' }));
		await user.click(select);
		await user.click(screen.getByRole('option', { name: 'Select a make…' }));

		expect(screen.getByRole('status')).toBeEmptyDOMElement();
		expect(select).toHaveTextContent('Select a make…');
	});
});
