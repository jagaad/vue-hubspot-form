import { defineConfig } from 'vite';
import path from 'path';
import vue from '@vitejs/plugin-vue';

// https://vitejs.dev/config/
export default defineConfig({
	plugins: [vue()],
	optimizeDeps: {
		exclude: ['vue-demi'],
	},
	build: {
		lib: {
			entry: path.resolve(__dirname, 'src/hubspot-form.ts'),
			name: 'HubSpotForm',
			fileName: (format) => `hubspot-form.${format}.js`,
		},
		rollupOptions: {
			external: ['vue', 'vue-demi'],
			output: {
				exports: 'named',
				globals: {
					'vue': 'Vue',
					'vue-demi': 'VueDemi',
				},
			},
		},
	},
});
