import { defineConfig } from 'vite';
import vue from '@vitejs/plugin-vue';
import * as path from 'path';

// https://vitejs.dev/config/
export default defineConfig({
    plugins: [vue()],
    server: {
        proxy: {
            '/api/': {
                target: 'http://10.160.139.217:10000/',
                changeOrigin: true,
                rewrite: (path) => path.replace(/^\/api/, '')
            }
        }
    },
    build: {
        lib: {
            entry: path.resolve(__dirname, './src/v-demi-request/index.ts'),
            name: 'v-demi-request',
            fileName: 'index'
        },
        rollupOptions: {
            external: ['vue', '@vue/composition-api', 'vue-demi', 'vue2'],
            output: {
                // 在 UMD 构建模式下为这些外部化的依赖提供一个全局变量
                globals: {
                    vue: 'Vue',
                    '@vue/composition-api': 'Vue2CompositionApi',
                    vue2: 'Vue2',
                    'vue-demi': 'VueDemi'
                }
            }
        },
        terserOptions: {
            compress: {
                drop_console: true
            }
        }
    },
    optimizeDeps: {
        exclude: ['vue-demi']
    }
});
