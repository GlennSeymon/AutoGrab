import type { VehicleSelection } from './vehicleSelection.ts';

export interface QuickSelectVehicle {
	readonly label: string;
	readonly selection: Readonly<VehicleSelection>;
}

export const QUICK_SELECT_VEHICLES: readonly QuickSelectVehicle[] = [
	{
		label: 'Tesla Model 3 Performance',
		selection: { make: 'tesla', model: 'Model 3', badge: 'Performance' },
	},
	{
		label: 'BMW 130d xDrive 26d',
		selection: { make: 'bmw', model: '130d', badge: 'xDrive 26d' },
	},
];
