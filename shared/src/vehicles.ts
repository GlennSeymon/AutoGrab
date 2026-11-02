import vehiclesJson from './vehicles.json' with { type: 'json' };

export type Make = string;
export type Model = string;
export type Badge = string;

export type BadgesByModel = Readonly<Record<Model, readonly Badge[]>>;

export type VehicleData = Readonly<Record<Make, BadgesByModel>>;

export const vehicleData: VehicleData = vehiclesJson;

export function getMakes(): readonly Make[] {
	return Object.keys(vehicleData).toSorted();
}

export function getModels(make: string): readonly Model[] {
	return Object.hasOwn(vehicleData, make)
		? Object.keys(vehicleData[make]).toSorted()
		: [];
}

export function getBadges(make: string, model: string): readonly Badge[] {
	return getModels(make).includes(model)
		? vehicleData[make][model].toSorted()
		: [];
}

export function formatMake(make: string): string {
	return make.charAt(0).toUpperCase() + make.slice(1);
}
