import { UPLOAD_PATH } from '@autograb/shared';
import express, { type Request, type Response } from 'express';
import { handleErrors, handleNotFound } from './errors.ts';
import { handleUpload, parseLogbook, validateSelection } from './upload.ts';

interface HealthResponse {
	status: 'ok';
}

export function createApp() {
	const app = express();

	app.get('/api/health', (_req: Request, res: Response<HealthResponse>) => {
		res.json({ status: 'ok' });
	});

	app.post(UPLOAD_PATH, parseLogbook, validateSelection, handleUpload);

	app.use('/api', handleNotFound);
	app.use(handleErrors);

	return app;
}
