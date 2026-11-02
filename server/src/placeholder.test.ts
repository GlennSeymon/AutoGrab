import { describe, expect, it } from 'vitest';

// Placeholder so `npm test` has something to run; replaced by the Supertest suite in Phase 2.
describe('server', () => {
	it('runs tests in a Node environment', () => {
		expect(typeof process.versions.node).toBe('string');
	});
});
