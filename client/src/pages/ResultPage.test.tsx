import type { UploadResponse } from '@autograb/shared';
import { render, screen } from '@testing-library/react';
import { MemoryRouter } from 'react-router';
import { describe, expect, it } from 'vitest';
import ResultPage from './ResultPage.tsx';

const EMPTY_MESSAGE = 'Nothing has been submitted yet';

const response: UploadResponse = {
	make: 'ford',
	model: 'Falcon',
	badge: 'XR6',
	logbook: null,
};

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

	it('treats invalid state the same as missing state', () => {
		renderWithState({ make: 'ford', model: 42 });

		expect(screen.getByText(EMPTY_MESSAGE)).toBeInTheDocument();
	});

	it('does not show the empty state for a valid response', () => {
		renderWithState(response);

		expect(screen.queryByText(EMPTY_MESSAGE)).not.toBeInTheDocument();
	});
});
