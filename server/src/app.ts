import express, { type Request, type Response } from 'express';

interface HealthResponse {
	status: 'ok';
}

export function createApp() {
	const app = express();

	app.get('/api/health', (_req: Request, res: Response<HealthResponse>) => {
		res.json({ status: 'ok' });
	});

	return app;
}
