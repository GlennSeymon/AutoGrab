import { describe, expect, it } from 'vitest';
import { vehicleSelectionSchema } from './vehicleSelection.ts';

function issuesFor(input: unknown) {
	const result = vehicleSelectionSchema.safeParse(input);
	expect(result.success).toBe(false);
	return result.error!.issues.map(({ path, message }) => ({ path, message }));
}

describe('vehicleSelectionSchema', () => {
	it('accepts a valid make, model and badge', () => {
		const selection = { make: 'ford', model: 'Falcon Ute', badge: 'XR6' };
		expect(vehicleSelectionSchema.safeParse(selection)).toEqual({
			success: true,
			data: selection,
		});
	});

	it.each([
		['make', { model: 'Ranger', badge: 'Raptor' }, 'Select a make'],
		['model', { make: 'ford', model: '', badge: 'Raptor' }, 'Select a model'],
		['badge', { make: 'ford', model: 'Ranger' }, 'Select a badge'],
	])('reports a missing %s on that field', (field, input, message) => {
		expect(issuesFor(input)).toEqual([{ path: [field], message }]);
	});

	it.each([
		[
			'make',
			{ make: 'holden', model: 'Commodore', badge: 'SS' },
			'Select a valid make',
		],
		[
			'model',
			{ make: 'ford', model: '130d', badge: 'xDrive 26d' },
			'Select a valid model for this make',
		],
		[
			'badge',
			{ make: 'ford', model: 'Falcon Ute', badge: 'XR8' },
			'Select a valid badge for this model',
		],
	])('reports an invalid %s on that field only', (field, input, message) => {
		expect(issuesFor(input)).toEqual([{ path: [field], message }]);
	});
});
