import { describe, expect, it } from 'vitest';
import { formatMake, getBadges, getMakes, getModels } from './vehicles.ts';

describe('getMakes', () => {
	it('returns every make sorted by name', () => {
		expect(getMakes()).toEqual(['bmw', 'ford', 'tesla']);
	});
});

describe('getModels', () => {
	it('returns the models for a make sorted by name', () => {
		expect(getModels('ford')).toEqual(['Falcon', 'Falcon Ute', 'Ranger']);
		expect(getModels('bmw')).toEqual(['130d', '240i', '320e']);
	});

	it.each(['', 'holden', 'Ford', 'constructor', '__proto__', 'toString'])(
		'returns [] for unknown make %j',
		(make) => {
			expect(getModels(make)).toEqual([]);
		},
	);
});

describe('getBadges', () => {
	it('returns the badges for a make and model sorted by name', () => {
		expect(getBadges('ford', 'Ranger')).toEqual([
			'Raptor',
			'Raptor X',
			'Wildtrak',
		]);
		expect(getBadges('tesla', 'Model 3')).toEqual([
			'Dual Motor',
			'Long Range',
			'Performance',
		]);
	});

	it.each([
		['unknown make', 'holden', 'Commodore'],
		['unknown model', 'ford', 'Mustang'],
		['model from another make', 'ford', '130d'],
		['wrong case', 'ford', 'ranger'],
		['empty strings', '', ''],
		['inherited key as make', 'constructor', 'name'],
		['inherited key as model', 'ford', 'constructor'],
	])('returns [] for %s', (_case, make, model) => {
		expect(getBadges(make, model)).toEqual([]);
	});
});

describe('formatMake', () => {
	it.each([
		['ford', 'Ford'],
		['bmw', 'BMW'],
		['tesla', 'Tesla'],
	])('formats %j as %j', (make, expected) => {
		expect(formatMake(make)).toBe(expected);
	});
});
