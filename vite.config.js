import { defineConfig } from 'vite';

export default defineConfig({
	server: {
		port: 5173,
		strictPort: false,
		proxy: {
			'/api': {
				target: 'http://localhost:3001',
				changeOrigin: true,
				secure: false
			}
		}
	},
	build: {
		target: 'es2015',
		rollupOptions: {
			external: [],
			output: {
				manualChunks: undefined
			}
		}
	},
	optimizeDeps: {
		include: ['@material/web/all.js'],
		exclude: []
	}
});
