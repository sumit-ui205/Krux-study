import fs from 'fs';
import path from 'path';
import {defineConfig} from 'vite';

const toolsDir = path.resolve(__dirname, 'tools');
const toolInputs: Record<string, string> = {};

if (fs.existsSync(toolsDir)) {
  for (const file of fs.readdirSync(toolsDir)) {
    if (file.endsWith('.html')) {
      const entryName = `tools/${file.replace(/\.html$/, '')}`;
      toolInputs[entryName] = path.resolve(toolsDir, file);
    }
  }
}

export default defineConfig(() => {
  return {
    base: './',
    build: {
      rollupOptions: {
        input: {
          main: path.resolve(__dirname, 'index.html'),
          ...toolInputs,
        },
      },
    },
    plugins: [
      {
        name: 'copy-static-assets',
        apply: 'build',
        closeBundle(error?: Error): void {
          if (error) {
            return;
          }
          const distDir = path.resolve(__dirname, 'dist');
          const srcAssets = path.resolve(__dirname, 'assets');
          const distAssets = path.resolve(distDir, 'assets');
          if (fs.existsSync(distDir) && fs.existsSync(srcAssets)) {
            fs.cpSync(srcAssets, distAssets, {recursive: true, force: true});
          }
        },
      },
    ],
    server: {
      hmr: process.env.DISABLE_HMR !== 'true',
      watch: process.env.DISABLE_HMR === 'true' ? null : {},
    },
  };
});
