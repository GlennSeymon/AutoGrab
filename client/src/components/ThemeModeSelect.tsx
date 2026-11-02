import DarkModeIcon from '@mui/icons-material/DarkMode';
import LightModeIcon from '@mui/icons-material/LightMode';
import SettingsBrightnessIcon from '@mui/icons-material/SettingsBrightness';
import IconButton from '@mui/material/IconButton';
import ListItemIcon from '@mui/material/ListItemIcon';
import ListItemText from '@mui/material/ListItemText';
import Menu from '@mui/material/Menu';
import MenuItem from '@mui/material/MenuItem';
import { useColorScheme } from '@mui/material/styles';
import { type MouseEvent, useState } from 'react';

const THEME_MODE_OPTIONS = [
	{ value: 'system', label: 'System', Icon: SettingsBrightnessIcon },
	{ value: 'light', label: 'Light', Icon: LightModeIcon },
	{ value: 'dark', label: 'Dark', Icon: DarkModeIcon },
] as const;

type ThemeMode = (typeof THEME_MODE_OPTIONS)[number]['value'];

function ThemeModeSelect() {
	const { mode, setMode } = useColorScheme();
	const [anchorEl, setAnchorEl] = useState<HTMLElement | null>(null);

	const current = THEME_MODE_OPTIONS.find(({ value }) => value === mode);

	if (!current) {
		return null;
	}

	const openMenu = (event: MouseEvent<HTMLElement>) => {
		setAnchorEl(event.currentTarget);
	};

	const closeMenu = () => {
		setAnchorEl(null);
	};

	const selectMode = (value: ThemeMode) => {
		setMode(value);
		closeMenu();
	};

	return (
		<>
			<IconButton
				aria-label={`Theme: ${current.label}`}
				aria-haspopup="menu"
				aria-expanded={anchorEl !== null}
				onClick={openMenu}
			>
				<current.Icon />
			</IconButton>
			<Menu anchorEl={anchorEl} open={anchorEl !== null} onClose={closeMenu}>
				{THEME_MODE_OPTIONS.map(({ value, label, Icon }) => (
					<MenuItem
						key={value}
						selected={value === mode}
						onClick={() => selectMode(value)}
					>
						<ListItemIcon>
							<Icon fontSize="small" />
						</ListItemIcon>
						<ListItemText>{label}</ListItemText>
					</MenuItem>
				))}
			</Menu>
		</>
	);
}

export default ThemeModeSelect;
