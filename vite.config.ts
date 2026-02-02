import { sveltekit } from '@sveltejs/kit/vite';
import { defineConfig } from 'vite';
import tailwindcss from '@tailwindcss/vite';

export default defineConfig({
	  server: {
    port: 5210,
    open: true
  },
	plugins: [
		    tailwindcss(),
sveltekit()]
});
