import { LOGBOOK_MAX_BYTES } from '@autograb/shared';
import { describe, expect, it } from 'vitest';
import {
	EMPTY_FORM_VALUES,
	LOGBOOK_TOO_LARGE_MESSAGE,
	nextFormValues,
	vehicleFormSchema,
	type VehicleFormValues,
} from './vehicleForm.ts';

const logbook = new File(['Serviced'], 'logbook.txt', { type: 'text/plain' });

const filled: VehicleFormValues = {
	make: 'ford',
	model: 'Falcon',
	badge: 'XR6',
	logbook,
};

describe('nextFormValues', () => {
	it.each([
		['make', 'bmw', { ...EMPTY_FORM_VALUES, make: 'bmw' }],
		[
			'model',
			'Ranger',
			{ make: 'ford', model: 'Ranger', badge: '', logbook: undefined },
		],
		[
			'badge',
			'XR8',
			{ make: 'ford', model: 'Falcon', badge: 'XR8', logbook: undefined },
		],
	] as const)(
		'setting the %s clears the fields below it and the logbook',
		(field, value, expected) => {
			expect(nextFormValues(filled, field, value)).toEqual(expected);
		},
	);

	it.each([
		['make', EMPTY_FORM_VALUES],
		['model', { make: 'ford', model: '', badge: '', logbook: undefined }],
		['badge', { make: 'ford', model: 'Falcon', badge: '', logbook: undefined }],
	] as const)(
		'choosing the %s placeholder clears it and everything below it',
		(field, expected) => {
			expect(nextFormValues(filled, field, '')).toEqual(expected);
		},
	);
});

describe('vehicleFormSchema', () => {
	const selection = { make: 'ford', model: 'Falcon', badge: 'XR6' };

	function logbookIssues(file: File) {
		const result = vehicleFormSchema.safeParse({ ...selection, logbook: file });
		return result.error?.issues.map(({ path, message }) => ({ path, message }));
	}

	it('accepts a logbook of exactly the size limit and rejects one byte more', () => {
		const atLimit = new File([new Uint8Array(LOGBOOK_MAX_BYTES)], 'max.txt');
		const overLimit = new File(
			[new Uint8Array(LOGBOOK_MAX_BYTES + 1)],
			'big.txt',
		);
		expect(logbookIssues(atLimit)).toBeUndefined();
		expect(logbookIssues(overLimit)).toEqual([
			{ path: ['logbook'], message: LOGBOOK_TOO_LARGE_MESSAGE },
		]);
	});
});
