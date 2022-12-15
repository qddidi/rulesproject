import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import path from 'path';
import { normalizePath } from 'vite';
import viteEslint from 'vite-plugin-eslint';
const variablePath = normalizePath(path.resolve('./src/variable.scss'));
// https://vitejs.dev/config/
export default defineConfig({
    plugins: [react(), viteEslint()],
    root: path.join(__dirname, 'src'),
    publicDir: '../public',
    css: {
        preprocessorOptions: {
            scss: {
                additionalData: `@import "${variablePath}";`
            }
        }
    },
    server: {
        port: 8989
    }
});
