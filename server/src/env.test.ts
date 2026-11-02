import { describe, expect, it } from 'vitest';
import { parseEnv } from './env.ts';

describe('parseEnv', () => {
	it('defaults PORT to 3001', () => {
		expect(parseEnv({})).toEqual({ PORT: 3001 });
	});

	it('coerces PORT to a number', () => {
		expect(parseEnv({ PORT: '4000' })).toEqual({ PORT: 4000 });
	});

	it.each(['abc', '0', '-1', '3.5'])(
		'rejects PORT=%s with a message naming PORT',
		(port) => {
			expect(() => parseEnv({ PORT: port })).toThrow(
				/Invalid environment variables:[\s\S]*PORT/,
			);
		},
	);
});
