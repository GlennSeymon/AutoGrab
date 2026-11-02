import { createTheme } from '@mui/material/styles';

const headingFontFamily = 'Verdana, Geneva, "DejaVu Sans", sans-serif';

const theme = createTheme({
	colorSchemes: {
		light: {
			palette: {
				primary: {
					main: '#0033FF',
					dark: '#1E40AF',
					contrastText: '#FFFFFF',
				},
				error: {
					main: '#DC2626',
				},
				text: {
					primary: '#0F172A',
					secondary: '#334155',
				},
				divider: '#E5E7EB',
			},
		},
		dark: {
			palette: {
				primary: {
					main: '#6684FF',
					contrastText: '#0F172A',
				},
				error: {
					main: '#F87171',
				},
				background: {
					default: '#0F172A',
					paper: '#1E293B',
				},
				text: {
					primary: '#F1F5F9',
					secondary: '#CBD5E1',
				},
				divider: '#334155',
			},
		},
	},
	typography: {
		fontFamily:
			'system-ui, -apple-system, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif',
		h1: { fontFamily: headingFontFamily },
		h2: { fontFamily: headingFontFamily },
		h3: { fontFamily: headingFontFamily },
		h4: { fontFamily: headingFontFamily },
		h5: { fontFamily: headingFontFamily },
		h6: { fontFamily: headingFontFamily },
		button: { textTransform: 'none', fontWeight: 600 },
	},
	shape: {
		borderRadius: 8,
	},
});

export default theme;
