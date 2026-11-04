import { QUICK_SELECT_VEHICLES } from '@autograb/shared';
import { act, renderHook } from '@testing-library/react';
import { describe, expect, it } from 'vitest';
import { useVehicleForm } from './useVehicleForm.ts';

describe('useVehicleForm', () => {
	it('clears the logbook, its errors and its input when the selection changes', async () => {
		const { result } = renderHook(() => useVehicleForm());
		act(() => result.current.quickSelect(QUICK_SELECT_VEHICLES[0].selection));
		await act(() =>
			result.current.form.setValue('logbook', new File([], 'empty.txt'), {
				shouldValidate: true,
			}),
		);
		expect(result.current.form.formState.errors.logbook).toBeDefined();
		const { logbookInputKey } = result.current;

		act(() => result.current.selectField('badge', 'Long Range'));

		expect(result.current.form.getValues('logbook')).toBeUndefined();
		expect(result.current.form.formState.errors.logbook).toBeUndefined();
		expect(result.current.logbookInputKey).not.toBe(logbookInputKey);
	});
});
