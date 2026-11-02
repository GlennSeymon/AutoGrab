import { uploadResponseSchema } from '@autograb/shared';
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';
import { useLocation } from 'react-router';

function ResultPage() {
	const location = useLocation();
	const result = uploadResponseSchema.safeParse(location.state);

	return (
		<Stack spacing={3}>
			<Typography variant="h5" component="h2">
				Upload result
			</Typography>
			{!result.success && (
				<Typography>Nothing has been submitted yet</Typography>
			)}
		</Stack>
	);
}

export default ResultPage;
