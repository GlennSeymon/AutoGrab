import {
	LOGBOOK_EMPTY_MESSAGE,
	LOGBOOK_MAX_BYTES,
	LOGBOOK_TOO_LARGE_MESSAGE,
	QUICK_SELECT_VEHICLES,
} from '@autograb/shared';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import { useVehicleForm } from '../form/useVehicleForm.ts';
import LogbookInput from './LogbookInput.tsx';

const LOGBOOK = new File(['2020/05/01: Initial Service'], 'logbook.txt', {
	type: 'text/plain',
});

let user: ReturnType<typeof userEvent.setup>;
const onSubmit = vi.fn();

function TestForm() {
	const { form, logbookInputKey, removeLogbook, clear, quickSelect } =
		useVehicleForm();

	return (
		<form onSubmit={form.handleSubmit(onSubmit)}>
			<button
				type="button"
				onClick={() => quickSelect(QUICK_SELECT_VEHICLES[0].selection)}
			>
				Select vehicle
			</button>
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
			<button type="submit">Submit</button>
		</form>
	);
}

async function attach(file: File) {
	await user.upload(screen.getByLabelText('Attach logbook'), file);
}

function removeButton() {
	return screen.queryByRole('button', { name: 'Remove logbook.txt' });
}

beforeEach(() => {
	onSubmit.mockClear();
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

describe('LogbookInput errors', () => {
	const input = () => screen.getByLabelText('Attach logbook');

	beforeEach(async () => {
		await user.click(screen.getByRole('button', { name: 'Select vehicle' }));
	});

	it.each([
		{
			problem: 'empty',
			file: new File([], 'empty.txt'),
			message: LOGBOOK_EMPTY_MESSAGE,
		},
		{
			problem: 'over 1 MB',
			file: new File([new Uint8Array(LOGBOOK_MAX_BYTES + 1)], 'big.txt'),
			message: LOGBOOK_TOO_LARGE_MESSAGE,
		},
	])(
		'shows an error for an $problem file and blocks submit',
		async ({ file, message }) => {
			await attach(file);

			expect(screen.getByText(message)).toBeInTheDocument();
			expect(input()).toHaveAccessibleDescription(message);
			expect(input()).toBeInvalid();

			await user.click(screen.getByRole('button', { name: 'Submit' }));

			expect(onSubmit).not.toHaveBeenCalled();
		},
	);

	it('submits a valid file', async () => {
		await attach(LOGBOOK);
		await user.click(screen.getByRole('button', { name: 'Submit' }));

		expect(onSubmit).toHaveBeenCalledOnce();
	});
});
