import Container from '@mui/material/Container';
import { styled } from '@mui/material/styles';
import Typography from '@mui/material/Typography';
import { Outlet } from 'react-router';

const PageContainer = styled(Container)(({ theme }) => ({
	paddingBlock: theme.spacing(4),
}));

const Header = styled('header')(({ theme }) => ({
	marginBottom: theme.spacing(3),
}));

function Layout() {
	return (
		<PageContainer maxWidth="sm">
			<Header>
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
