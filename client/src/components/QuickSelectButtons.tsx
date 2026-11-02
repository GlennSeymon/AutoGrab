import { QUICK_SELECT_VEHICLES, type VehicleSelection } from '@autograb/shared';
import Button from '@mui/material/Button';
import Stack from '@mui/material/Stack';

interface QuickSelectButtonsProps {
	selection: VehicleSelection;
	onSelect: (selection: VehicleSelection) => void;
}

function isActive(preset: VehicleSelection, selection: VehicleSelection) {
	return (
		preset.make === selection.make &&
		preset.model === selection.model &&
		preset.badge === selection.badge
	);
}

function QuickSelectButtons({ selection, onSelect }: QuickSelectButtonsProps) {
	return (
		<Stack
			direction="row"
			spacing={1}
			useFlexGap
			sx={{ flexWrap: 'wrap' }}
			role="group"
			aria-label="Quick select"
		>
			{QUICK_SELECT_VEHICLES.map((vehicle) => {
				const active = isActive(vehicle.selection, selection);
				return (
					<Button
						key={vehicle.label}
						variant={active ? 'contained' : 'outlined'}
						aria-pressed={active}
						onClick={() => onSelect(vehicle.selection)}
					>
						{vehicle.label}
					</Button>
				);
			})}
		</Stack>
	);
}

export default QuickSelectButtons;
