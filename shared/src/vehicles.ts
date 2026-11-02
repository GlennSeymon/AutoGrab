import vehiclesJson from './vehicles.json' with { type: 'json' };

export type Make = string;
export type Model = string;
export type Badge = string;

/** A make's models, each with its badges, in the order supplied in the brief. */
export type BadgesByModel = Readonly<Record<Model, readonly Badge[]>>;

/** Make → Model → Badges, in the order supplied in the brief. */
export type VehicleData = Readonly<Record<Make, BadgesByModel>>;

export const vehicleData: VehicleData = vehiclesJson;
