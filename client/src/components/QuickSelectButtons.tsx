import { QUICK_SELECT_VEHICLES, type VehicleSelection } from '@autograb/shared';
import Button from '@mui/material/Button';
import Stack from '@mui/material/Stack';
import { styled } from '@mui/material/styles';

const ButtonGroup = styled(Stack)({
	flexWrap: 'wrap',
});

interface QuickSelectButtonsProps {
	selection: VehicleSelection;
	onSelect: (selection: VehicleSelection) => void;
	disabled?: boolean;
}

function isActive(preset: VehicleSelection, selection: VehicleSelection) {
	return (
		preset.make === selection.make &&
		preset.model === selection.model &&
		preset.badge === selection.badge
	);
}

function QuickSelectButtons({
	selection,
	onSelect,
	disabled = false,
}: QuickSelectButtonsProps) {
	return (
		<ButtonGroup
			direction="row"
			spacing={1}
			useFlexGap
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
						disabled={disabled}
						onClick={() => onSelect(vehicle.selection)}
					>
						{vehicle.label}
					</Button>
				);
			})}
		</ButtonGroup>
	);
}

export default QuickSelectButtons;
