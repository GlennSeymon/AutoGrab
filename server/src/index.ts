import { createApp } from './app.ts';
import { parseEnv } from './env.ts';

const { PORT } = parseEnv(process.env);

createApp().listen(PORT, (error) => {
	if (error) {
		throw error;
	}
	console.log(`Server listening on http://localhost:${PORT}`);
});
