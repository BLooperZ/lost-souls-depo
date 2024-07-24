import { VitePWA } from 'vite-plugin-pwa';
import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import svgr from "vite-plugin-svgr";

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [
    svgr(),
    react(),
    VitePWA({
      registerType: 'autoUpdate',
      injectRegister: false,

      pwaAssets: {
        // disabled: false,
        config: true,
        overrideManifestIcons: true,
      },

      manifest: {
        name: 'האגף לנשמות אבודות',
        short_name: 'האגף',
        description: 'lost-souls-vite-pwa',
        theme_color: 'black', // #36976e',
        background_color: 'black',
        display: 'standalone',
      },

      workbox: {
        globPatterns: ['**/*.{js,css,html,svg,png,ico}'],
        cleanupOutdatedCaches: true,
        clientsClaim: true,
      },

      devOptions: {
        enabled: false,
        navigateFallback: 'index.html',
        suppressWarnings: true,
        type: 'module',
      },
    },
  )],
	css: {
		postcss: {
			map: true
		}
	}
})
