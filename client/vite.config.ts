import { fileURLToPath } from 'node:url';
import { loadEnv } from 'vite';
import { defineConfig } from 'vitest/config';
import react from '@vitejs/plugin-react';

const rootDir = fileURLToPath(new URL('..', import.meta.url));
const DEFAULT_SERVER_PORT = '3001';

// https://vite.dev/config/
export default defineConfig(({ mode }) => {
	const { PORT = DEFAULT_SERVER_PORT } = loadEnv(mode, rootDir, '');

	return {
		plugins: [react()],
		server: {
			proxy: {
				'/api': `http://localhost:${PORT}`,
			},
		},
		test: {
			environment: 'jsdom',
			setupFiles: ['./src/test/setup.ts'],
		},
	};
});
