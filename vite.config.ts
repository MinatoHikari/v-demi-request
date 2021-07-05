import { defineConfig } from 'vite';
import vue from '@vitejs/plugin-vue';
import * as path from 'path';

// https://vitejs.dev/config/
export default defineConfig({
    plugins: [vue()],
    build: {
        lib: {
            entry: path.resolve(__dirname, './src/v-demi-request/index.ts'),
            name: 'v-demi-request',
            fileName: 'index'
        },
    },
    optimizeDeps: {
        exclude: ['vue-demi']
    }
});
