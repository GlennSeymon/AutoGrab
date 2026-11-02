import { describe, expect, it } from 'vitest';
import { QUICK_SELECT_VEHICLES } from './quickSelect.ts';
import { vehicleSelectionSchema } from './vehicleSelection.ts';

describe('QUICK_SELECT_VEHICLES', () => {
	it.each(QUICK_SELECT_VEHICLES)(
		'$label is a valid vehicle selection',
		({ selection }) => {
			expect(vehicleSelectionSchema.safeParse(selection).success).toBe(true);
		},
	);
});
