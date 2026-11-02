import { render, screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';
import App from './App.tsx';

describe('App', () => {
	it('renders a heading', () => {
		render(<App />);

		expect(screen.getByRole('heading', { level: 1 })).toBeInTheDocument();
	});
});
