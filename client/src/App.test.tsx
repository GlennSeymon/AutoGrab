import { render, screen } from '@testing-library/react';
import { MemoryRouter } from 'react-router';
import { describe, expect, it } from 'vitest';
import App from './App.tsx';

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
