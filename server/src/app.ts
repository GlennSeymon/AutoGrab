import { UPLOAD_PATH } from '@autograb/shared';
import express, { type Request, type Response } from 'express';
import { parseLogbook, validateSelection } from './upload.ts';

interface HealthResponse {
	status: 'ok';
}

export function createApp() {
	const app = express();

	app.get('/api/health', (_req: Request, res: Response<HealthResponse>) => {
		res.json({ status: 'ok' });
	});

	app.post(UPLOAD_PATH, parseLogbook, validateSelection);

	return app;
}
