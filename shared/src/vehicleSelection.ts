import { z } from 'zod';
import { getBadges, getMakes, getModels } from './vehicles.ts';

function requiredString(message: string) {
	return z.string({ error: message }).min(1, { error: message, abort: true });
}

export const vehicleSelectionSchema = z
	.object({
		make: requiredString('Select a make'),
		model: requiredString('Select a model'),
		badge: requiredString('Select a badge'),
	})
	.superRefine(({ make, model, badge }, ctx) => {
		if (!getMakes().includes(make)) {
			ctx.addIssue({
				code: 'custom',
				path: ['make'],
				message: 'Select a valid make',
			});
		} else if (!getModels(make).includes(model)) {
			ctx.addIssue({
				code: 'custom',
				path: ['model'],
				message: 'Select a valid model for this make',
			});
		} else if (!getBadges(make, model).includes(badge)) {
			ctx.addIssue({
				code: 'custom',
				path: ['badge'],
				message: 'Select a valid badge for this model',
			});
		}
	});

export type VehicleSelection = z.infer<typeof vehicleSelectionSchema>;
