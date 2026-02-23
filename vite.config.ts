import react from '@vitejs/plugin-react';
import { defineConfig, loadEnv } from 'vite';
import { createHtmlPlugin } from 'vite-plugin-html';
import { VitePWA } from 'vite-plugin-pwa';
import { APP_CONFIG } from './src/config/app.config';

// https://vitejs.dev/config/
export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd(), '');

  return {
    base: '/',
    plugins: [
      react(),
      createHtmlPlugin({
        inject: {
          data: {
            metaTitle: env.VITE_SEO_TITLE || 'Portfolio',
            metaDescription: env.VITE_SEO_DESCRIPTION || '',
            metaImageURL: env.VITE_SEO_IMAGE_URL || '',
          },
        },
      }),
      ...(APP_CONFIG.enablePWA
        ? [
            VitePWA({
              registerType: 'autoUpdate',
              workbox: {
                navigateFallback: undefined,
              },
              includeAssets: ['logo.png'],
              manifest: {
                name: 'Portfolio',
                short_name: 'Portfolio',
                description: 'Personal Portfolio',
                icons: [
                  {
                    src: 'logo.png',
                    sizes: '64x64 32x32 24x24 16x16 192x192 512x512',
                    type: 'image/png',
                  },
                ],
              },
            }),
          ]
        : []),
    ],
    ssr: {
      noExternal: ['@vercel/analytics'],
    },
    optimizeDeps: {
      exclude: ['@vercel/analytics'],
    },
  };
});
