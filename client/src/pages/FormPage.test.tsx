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

describe('FormPage quick select', () => {
	function preset(name: string) {
		return screen.getByRole('button', { name });
	}

	it('fills all three fields and highlights only the chosen preset', async () => {
		await user.click(preset('BMW 130d xDrive 26d'));

		expect(field('Make')).toHaveTextContent('Bmw');
		expect(field('Model')).toHaveTextContent('130d');
		expect(field('Badge')).toHaveTextContent('xDrive 26d');
		expect(preset('BMW 130d xDrive 26d')).toHaveAttribute(
			'aria-pressed',
			'true',
		);
		expect(preset('Tesla Model 3 Performance')).toHaveAttribute(
			'aria-pressed',
			'false',
		);
	});

	it('highlights the preset matching a manual selection', async () => {
		await choose('Make', 'Tesla');
		await choose('Model', 'Model 3');
		expect(preset('Tesla Model 3 Performance')).toHaveAttribute(
			'aria-pressed',
			'false',
		);

		await choose('Badge', 'Performance');

		expect(preset('Tesla Model 3 Performance')).toHaveAttribute(
			'aria-pressed',
			'true',
		);
	});

	it('ends in the same state as a manual selection', async () => {
		await user.click(preset('Tesla Model 3 Performance'));
		await choose('Model', 'Select a model…');

		expect(field('Make')).toHaveTextContent('Tesla');
		expect(field('Model')).toHaveTextContent('Select a model…');
		expect(field('Badge')).not.toBeInTheDocument();
		expect(preset('Tesla Model 3 Performance')).toHaveAttribute(
			'aria-pressed',
			'false',
		);
	});
});

describe('FormPage clear', () => {
	it('returns the form to its initial state', async () => {
		await user.click(
			screen.getByRole('button', { name: 'Tesla Model 3 Performance' }),
		);

		await user.click(screen.getByRole('button', { name: 'Clear' }));

		expect(field('Make')).toHaveTextContent('Select a make…');
		expect(field('Model')).not.toBeInTheDocument();
		expect(field('Badge')).not.toBeInTheDocument();
		expect(
			screen.getByRole('button', { name: 'Tesla Model 3 Performance' }),
		).toHaveAttribute('aria-pressed', 'false');
	});
});

describe('FormPage logbook and submit', () => {
	const LOGBOOK = new File(['2020/05/01: Initial Service'], 'logbook.txt', {
		type: 'text/plain',
	});

	function logbookInput() {
		return screen.queryByLabelText('Attach logbook');
	}

	function submitButton() {
		return screen.queryByRole('button', { name: 'Submit' });
	}

	it('appears only once a Badge is selected', async () => {
		await choose('Make', 'Ford');
		await choose('Model', 'Falcon');
		expect(logbookInput()).not.toBeInTheDocument();
		expect(submitButton()).not.toBeInTheDocument();

		await choose('Badge', 'XR6');
		expect(logbookInput()).toBeInTheDocument();
		expect(submitButton()).toBeInTheDocument();

		await choose('Badge', 'Select a badge…');
		expect(logbookInput()).not.toBeInTheDocument();
		expect(submitButton()).not.toBeInTheDocument();
	});

	it('clears the logbook when a new Badge is chosen', async () => {
		await choose('Make', 'Ford');
		await choose('Model', 'Falcon');
		await choose('Badge', 'XR6');
		await user.upload(logbookInput()!, LOGBOOK);
		expect(screen.getByText('logbook.txt')).toBeInTheDocument();

		await choose('Badge', 'XR8');

		expect(screen.queryByText('logbook.txt')).not.toBeInTheDocument();
		expect(logbookInput()).toHaveProperty('files.length', 0);
	});
});
