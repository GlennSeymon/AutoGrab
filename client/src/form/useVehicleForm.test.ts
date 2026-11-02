import { QUICK_SELECT_VEHICLES } from '@autograb/shared';
import { act, renderHook } from '@testing-library/react';
import { describe, expect, it } from 'vitest';
import { useVehicleForm } from './useVehicleForm.ts';
import { EMPTY_FORM_VALUES } from './vehicleForm.ts';

function renderVehicleForm() {
	return renderHook(() => useVehicleForm()).result;
}

describe('useVehicleForm', () => {
	it('starts with formatted makes and nothing below Make shown', () => {
		const result = renderVehicleForm();

		expect(result.current.makeOptions).toEqual([
			{ value: 'bmw', label: 'Bmw' },
			{ value: 'ford', label: 'Ford' },
			{ value: 'tesla', label: 'Tesla' },
		]);
		expect(result.current.showModel).toBe(false);
		expect(result.current.showBadge).toBe(false);
		expect(result.current.isSelectionComplete).toBe(false);
	});

	it('loads the options for each selection until it is complete', () => {
		const result = renderVehicleForm();

		act(() => result.current.selectField('make', 'ford'));
		expect(result.current.showModel).toBe(true);
		expect(result.current.modelOptions.map(({ value }) => value)).toEqual([
			'Falcon',
			'Falcon Ute',
			'Ranger',
		]);

		act(() => result.current.selectField('model', 'Falcon Ute'));
		expect(result.current.showBadge).toBe(true);
		expect(result.current.badgeOptions.map(({ value }) => value)).toEqual([
			'XR6',
			'XR6 Turbo',
		]);

		act(() => result.current.selectField('badge', 'XR6'));
		expect(result.current.isSelectionComplete).toBe(true);
	});

	it('clears the logbook, its errors and its input when the selection changes', async () => {
		const result = renderVehicleForm();
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

	it('quick-select ends in the same state as a manual selection', () => {
		const manual = renderVehicleForm();
		act(() => manual.current.selectField('make', 'bmw'));
		act(() => manual.current.selectField('model', '130d'));
		act(() => manual.current.selectField('badge', 'xDrive 26d'));

		const quick = renderVehicleForm();
		act(() => quick.current.quickSelect(QUICK_SELECT_VEHICLES[1].selection));

		expect(quick.current.form.getValues()).toEqual(
			manual.current.form.getValues(),
		);
		expect(quick.current.badgeOptions).toEqual(manual.current.badgeOptions);
		expect(quick.current.isSelectionComplete).toBe(true);
	});

	it('clear returns to the initial values', () => {
		const result = renderVehicleForm();
		act(() => result.current.quickSelect(QUICK_SELECT_VEHICLES[0].selection));

		act(() => result.current.clear());

		expect(result.current.form.getValues()).toEqual(EMPTY_FORM_VALUES);
		expect(result.current.showModel).toBe(false);
	});
});
