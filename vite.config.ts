import react from '@vitejs/plugin-react';
import { readFileSync } from 'node:fs';
import { resolve } from 'node:path';
import { defineConfig } from 'vite';
import { createHtmlPlugin } from 'vite-plugin-html';
import { VitePWA } from 'vite-plugin-pwa';
import { APP_CONFIG } from './src/config/app.config';
import {
    buildHtmlInjectData,
    resolveSeoConfig,
} from './src/config/seo.config';
import type { SiteContent } from './src/types';
import { seoBuildPlugin } from './vite.seoPlugin';

const readSiteContent = (): SiteContent => {
  const raw = readFileSync(
    resolve(process.cwd(), 'src/generated/site-content.json'),
    'utf-8',
  );

  return JSON.parse(raw) as SiteContent;
};

export default defineConfig(() => {
  const seo = resolveSeoConfig(readSiteContent());

  return {
    base: '/',
    plugins: [
      react(),
      createHtmlPlugin({
        inject: {
          data: {
            ...buildHtmlInjectData(seo),
            gtmId: APP_CONFIG.analytics.gtmId,
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
