import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { beforeEach, describe, expect, it } from 'vitest';
import FormPage from './FormPage.tsx';

let user: ReturnType<typeof userEvent.setup>;

function field(label: string) {
	return screen.queryByRole('combobox', { name: label });
}

async function choose(label: string, option: string) {
	await user.click(screen.getByRole('combobox', { name: label }));
	await user.click(screen.getByRole('option', { name: option }));
}

beforeEach(() => {
	user = userEvent.setup();
	render(<FormPage />);
});

describe('FormPage vehicle selection', () => {
	it('shows only Make at first, with formatted makes', async () => {
		expect(field('Make')).toBeInTheDocument();
		expect(field('Model')).not.toBeInTheDocument();
		expect(field('Badge')).not.toBeInTheDocument();

		await user.click(screen.getByRole('combobox', { name: 'Make' }));
		expect(screen.getByRole('option', { name: 'Ford' })).toBeInTheDocument();
	});

	it('shows each field once its parent is selected', async () => {
		await choose('Make', 'Ford');
		expect(field('Model')).toBeInTheDocument();
		expect(field('Badge')).not.toBeInTheDocument();

		await choose('Model', 'Falcon');
		expect(field('Badge')).toBeInTheDocument();
	});

	it('clears Model and Badge when the Make changes', async () => {
		await choose('Make', 'Ford');
		await choose('Model', 'Falcon');
		await choose('Badge', 'XR6');

		await choose('Make', 'Bmw');

		expect(field('Model')).toHaveTextContent('Select a model…');
		expect(field('Badge')).not.toBeInTheDocument();
	});

	it('clears Badge when the Model changes', async () => {
		await choose('Make', 'Ford');
		await choose('Model', 'Falcon');
		await choose('Badge', 'XR6');

		await choose('Model', 'Falcon Ute');

		expect(field('Badge')).toHaveTextContent('Select a badge…');
	});

	it('clears the fields below when a placeholder is chosen', async () => {
		await choose('Make', 'Ford');
		await choose('Model', 'Falcon');
		await choose('Badge', 'XR6');

		await choose('Make', 'Select a make…');

		expect(field('Make')).toHaveTextContent('Select a make…');
		expect(field('Model')).not.toBeInTheDocument();
		expect(field('Badge')).not.toBeInTheDocument();
	});
});
