import react from '@vitejs/plugin-react';
import { defineConfig, loadEnv } from 'vite';
import { createHtmlPlugin } from 'vite-plugin-html';
import { VitePWA } from 'vite-plugin-pwa';
import { APP_CONFIG } from './src/config/app.config';
import {
  buildHtmlInjectData,
  resolveSeoConfig,
} from './src/config/seo.config';
import { seoBuildPlugin } from './vite.seoPlugin';

export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd(), '');
  const seo = resolveSeoConfig(env);

  return {
    base: '/',
    plugins: [
      react(),
      createHtmlPlugin({
        inject: {
          data: {
            ...buildHtmlInjectData(seo),
            gtmId: env.VITE_GTM_ID || '',
          },
        },
      }),
      seoBuildPlugin(seo),
      ...(APP_CONFIG.enablePWA
        ? [
            VitePWA({
              registerType: 'autoUpdate',
              workbox: {
                navigateFallback: undefined,
              },
              includeAssets: ['logo.png'],
              manifest: {
                name: `${seo.brandName} Portfolio`,
                short_name: seo.brandName,
                description: seo.description,
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
