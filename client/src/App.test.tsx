import { HttpStatus, type UploadResponse, UPLOAD_PATH } from '@autograb/shared';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import axios from 'axios';
import AxiosMockAdapter from 'axios-mock-adapter';
import { MemoryRouter } from 'react-router';
import { afterEach, describe, expect, it } from 'vitest';
import App from './App.tsx';

const mock = new AxiosMockAdapter(axios);

afterEach(() => {
	mock.reset();
});

function renderAt(path: string) {
	render(
		<MemoryRouter initialEntries={[path]}>
			<App />
		</MemoryRouter>,
	);
}

describe('App routes', () => {
	it('renders the form page at /', () => {
		renderAt('/');

		expect(
			screen.getByRole('heading', { name: 'Select a vehicle' }),
		).toBeInTheDocument();
	});

	it('renders the result page at /upload', () => {
		renderAt('/upload');

		expect(
			screen.getByRole('heading', { name: 'Upload result' }),
		).toBeInTheDocument();
	});

	it('redirects unknown URLs to the form page', () => {
		renderAt('/nope');

		expect(
			screen.getByRole('heading', { name: 'Select a vehicle' }),
		).toBeInTheDocument();
	});
});

describe('App full flow', () => {
	it('submits a vehicle with a logbook, shows the result, then starts a fresh form', async () => {
		const user = userEvent.setup();
		const contents = '2020/05/01: Initial Service\n2021/05/01: Oil change';
		const response: UploadResponse = {
			make: 'ford',
			model: 'Falcon',
			badge: 'XR6',
			logbook: { filename: 'logbook.txt', contents },
		};
		mock.onPost(UPLOAD_PATH).reply(HttpStatus.OK, response);
		renderAt('/');

		async function choose(label: string, option: string) {
			await user.click(screen.getByRole('combobox', { name: label }));
			await user.click(screen.getByRole('option', { name: option }));
		}
		await choose('Make', 'Ford');
		await choose('Model', 'Falcon');
		await choose('Badge', 'XR6');
		await user.upload(
			screen.getByLabelText('Attach logbook'),
			new File([contents], 'logbook.txt', { type: 'text/plain' }),
		);
		await user.click(screen.getByRole('button', { name: 'Submit' }));

		expect(
			await screen.findByRole('heading', { name: 'Upload result' }),
		).toBeInTheDocument();
		const values = screen.getAllByRole('definition');
		expect(values.map((value) => value.textContent)).toEqual([
			'Ford',
			'Falcon',
			'XR6',
			'logbook.txt',
		]);

		await user.click(
			screen.getByRole('link', { name: 'Submit another vehicle' }),
		);

		expect(screen.getByRole('combobox', { name: 'Make' })).toHaveTextContent(
			'Select a make…',
		);
		expect(
			screen.queryByRole('combobox', { name: 'Model' }),
		).not.toBeInTheDocument();
	});
});
