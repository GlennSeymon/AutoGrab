import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { beforeEach, describe, expect, it } from 'vitest';
import { useVehicleForm } from '../form/useVehicleForm.ts';
import LogbookInput from './LogbookInput.tsx';

const LOGBOOK = new File(['2020/05/01: Initial Service'], 'logbook.txt', {
	type: 'text/plain',
});

let user: ReturnType<typeof userEvent.setup>;

function TestForm() {
	const { form, logbookInputKey, removeLogbook, clear } = useVehicleForm();

	return (
		<>
			<LogbookInput
				control={form.control}
				name="logbook"
				label="Attach logbook"
				inputKey={logbookInputKey}
				onRemove={removeLogbook}
			/>
			<button type="button" onClick={clear}>
				Clear
			</button>
		</>
	);
}

async function attach(file: File) {
	await user.upload(screen.getByLabelText('Attach logbook'), file);
}

function removeButton() {
	return screen.queryByRole('button', { name: 'Remove logbook.txt' });
}

beforeEach(() => {
	user = userEvent.setup();
	render(<TestForm />);
});

describe('LogbookInput', () => {
	it('shows the chosen filename with a Remove button', async () => {
		expect(removeButton()).not.toBeInTheDocument();

		await attach(LOGBOOK);

		expect(screen.getByText('logbook.txt')).toBeInTheDocument();
		expect(removeButton()).toBeInTheDocument();
	});

	it('removes the file and accepts the same file again', async () => {
		await attach(LOGBOOK);
		await user.click(removeButton()!);

		expect(screen.queryByText('logbook.txt')).not.toBeInTheDocument();
		expect(removeButton()).not.toBeInTheDocument();

		await attach(LOGBOOK);

		expect(screen.getByText('logbook.txt')).toBeInTheDocument();
	});

	it('clears the file when the form is reset', async () => {
		await attach(LOGBOOK);
		await user.click(screen.getByRole('button', { name: 'Clear' }));

		expect(screen.queryByText('logbook.txt')).not.toBeInTheDocument();
		expect(screen.getByLabelText('Attach logbook')).toHaveProperty(
			'files.length',
			0,
		);
	});
});
