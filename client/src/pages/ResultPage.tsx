import { formatMake, uploadResponseSchema } from '@autograb/shared';
import Stack from '@mui/material/Stack';
import { styled } from '@mui/material/styles';
import Typography from '@mui/material/Typography';
import { useLocation } from 'react-router';

const VehicleDetails = styled('dl')(({ theme }) => ({
	display: 'grid',
	gridTemplateColumns: 'max-content 1fr',
	columnGap: theme.spacing(2),
	rowGap: theme.spacing(1),
	margin: 0,
	'& dt': { fontWeight: theme.typography.fontWeightBold },
	'& dd': { margin: 0, overflowWrap: 'anywhere' },
}));

const LogbookContents = styled('pre')(({ theme }) => ({
	margin: 0,
	padding: theme.spacing(2),
	maxHeight: '24rem',
	overflow: 'auto',
	whiteSpace: 'pre-wrap',
	overflowWrap: 'anywhere',
	fontFamily: 'monospace',
	backgroundColor: theme.palette.action.hover,
	borderRadius: theme.shape.borderRadius,
}));

function ResultPage() {
	const location = useLocation();
	const result = uploadResponseSchema.safeParse(location.state);

	return (
		<Stack spacing={3}>
			<Typography variant="h5" component="h2">
				Upload result
			</Typography>
			{result.success ? (
				<>
					<VehicleDetails>
						<dt>Make</dt>
						<dd>{formatMake(result.data.make)}</dd>
						<dt>Model</dt>
						<dd>{result.data.model}</dd>
						<dt>Badge</dt>
						<dd>{result.data.badge}</dd>
						<dt>Logbook</dt>
						<dd>{result.data.logbook?.filename ?? 'No logbook submitted'}</dd>
					</VehicleDetails>
					{result.data.logbook && (
						<LogbookContents
							role="region"
							aria-label="Logbook contents"
							tabIndex={0}
						>
							{result.data.logbook.contents}
						</LogbookContents>
					)}
				</>
			) : (
				<Typography>Nothing has been submitted yet</Typography>
			)}
		</Stack>
	);
}

export default ResultPage;
