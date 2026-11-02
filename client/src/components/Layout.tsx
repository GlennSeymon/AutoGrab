import Container from '@mui/material/Container';
import { styled, useColorScheme } from '@mui/material/styles';
import Typography from '@mui/material/Typography';
import { Outlet } from 'react-router';
import ThemeModeSelect from './ThemeModeSelect.tsx';

const PageContainer = styled(Container)(({ theme }) => ({
	paddingBlock: theme.spacing(4),
}));

const Header = styled('header')(({ theme }) => ({
	marginBottom: theme.spacing(3),
}));

const HeaderBar = styled('div')(({ theme }) => ({
	display: 'flex',
	flexWrap: 'wrap',
	alignItems: 'center',
	justifyContent: 'space-between',
	gap: theme.spacing(1),
	marginBottom: theme.spacing(2),
}));

const Logo = styled('img')({
	display: 'block',
	height: 24,
	width: 'auto',
});

function Layout() {
	const { mode, systemMode } = useColorScheme();
	const isDark = (systemMode ?? mode) === 'dark';

	return (
		<PageContainer maxWidth="sm">
			<Header>
				<HeaderBar>
					<Logo
						src={
							isDark ? '/autograb-logo-white.svg' : '/autograb-logo-blue.svg'
						}
						alt="AutoGrab"
						width={168}
						height={24}
					/>
					<ThemeModeSelect />
				</HeaderBar>
				<Typography variant="h4" component="h1">
					Vehicle Selection Form
				</Typography>
			</Header>
			<main>
				<Outlet />
			</main>
		</PageContainer>
	);
}

export default Layout;
