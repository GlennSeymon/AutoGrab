import Box from '@mui/material/Box';
import Container from '@mui/material/Container';
import Typography from '@mui/material/Typography';
import { Outlet } from 'react-router';

function Layout() {
	return (
		<Container maxWidth="sm" sx={{ py: 4 }}>
			<Box component="header" sx={{ mb: 3 }}>
				<Typography variant="h4" component="h1">
					Vehicle Selection Form
				</Typography>
			</Box>
			<Box component="main">
				<Outlet />
			</Box>
		</Container>
	);
}

export default Layout;
