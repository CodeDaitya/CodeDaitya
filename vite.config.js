import { defineConfig } from 'vite';

export default defineConfig({
  base: '/',
  server: {
    watch: {
      awaitWriteFinish: true
    }
  }
});
