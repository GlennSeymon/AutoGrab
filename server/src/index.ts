import express, { type Request, type Response } from 'express';

const PORT = 3001;

interface HealthResponse {
	status: 'ok';
}

const app = express();

app.get('/api/health', (_req: Request, res: Response<HealthResponse>) => {
	res.json({ status: 'ok' });
});

app.listen(PORT, (error) => {
	if (error) {
		throw error;
	}
	console.log(`Server listening on http://localhost:${PORT}`);
});
