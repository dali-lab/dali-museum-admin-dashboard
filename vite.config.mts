import { defineConfig } from 'vite'
import react from "@vitejs/plugin-react";
import * as path from 'path';

// https://vitejs.dev/config/
export default defineConfig({
  base: '/',
  plugins: [react()],
  resolve: {
    // https://stackoverflow.com/a/73742188
    alias: [
        { find: '@', replacement: path.resolve(__dirname, 'src') },
    ],
}
});