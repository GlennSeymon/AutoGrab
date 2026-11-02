import type { UploadResponse } from '@autograb/shared';
import { render, screen } from '@testing-library/react';
import { MemoryRouter } from 'react-router';
import { describe, expect, it } from 'vitest';
import ResultPage from './ResultPage.tsx';

const EMPTY_MESSAGE = /Nothing has been submitted yet/;

const response: UploadResponse = {
	make: 'ford',
	model: 'Falcon',
	badge: 'XR6',
	logbook: null,
};

function detailPairs() {
	const values = screen.getAllByRole('definition');
	return screen
		.getAllByRole('term')
		.map((term, index) => [term.textContent, values[index]?.textContent]);
}

function renderWithState(state?: unknown) {
	render(
		<MemoryRouter initialEntries={[{ pathname: '/upload', state }]}>
			<ResultPage />
		</MemoryRouter>,
	);
}

describe('ResultPage state', () => {
	it('shows the empty state when there is no state', () => {
		renderWithState();

		expect(screen.getByText(EMPTY_MESSAGE)).toBeInTheDocument();
	});

	it('links back to the form from the empty state', () => {
		renderWithState();

		expect(
			screen.getByRole('link', { name: 'Select a vehicle' }),
		).toHaveAttribute('href', '/');
	});

	it('treats invalid state the same as missing state', () => {
		renderWithState({ make: 'ford', model: 42 });

		expect(screen.getByText(EMPTY_MESSAGE)).toBeInTheDocument();
	});

	it('does not show the empty state for a valid response', () => {
		renderWithState(response);

		expect(screen.queryByText(EMPTY_MESSAGE)).not.toBeInTheDocument();
	});
});

describe('ResultPage vehicle', () => {
	it('shows the submitted Make (formatted), Model and Badge', () => {
		renderWithState(response);

		expect(detailPairs().slice(0, 3)).toEqual([
			['Make', 'Ford'],
			['Model', 'Falcon'],
			['Badge', 'XR6'],
		]);
	});
});

describe('ResultPage logbook', () => {
	function logbookContents() {
		return screen.queryByRole('region', { name: 'Logbook contents' });
	}

	it('shows the filename and the full multi-line contents', () => {
		const contents = `Service 1: oil change\n${'x'.repeat(500)}\n\n  Indented line\n`;
		renderWithState({
			...response,
			logbook: { filename: 'logbook.txt', contents },
		});

		expect(detailPairs()).toContainEqual(['Logbook', 'logbook.txt']);
		expect(logbookContents()).toHaveTextContent(contents, {
			normalizeWhitespace: false,
		});
	});

	it('shows "No logbook submitted" when there is no logbook', () => {
		renderWithState(response);

		expect(detailPairs()).toContainEqual(['Logbook', 'No logbook submitted']);
		expect(logbookContents()).not.toBeInTheDocument();
	});

	it('shows HTML in the logbook as text instead of rendering it', () => {
		const contents = '<img src="x" alt="injected"><b>bold</b>';
		renderWithState({
			...response,
			logbook: { filename: 'logbook.txt', contents },
		});

		const region = logbookContents();
		expect(region).toHaveTextContent(contents);
		expect(region?.children).toHaveLength(0);
	});
});
