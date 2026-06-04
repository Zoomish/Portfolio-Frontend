import { writeFileSync } from 'node:fs';
import { resolve } from 'node:path';
import type { Plugin } from 'vite';
import {
  buildRobotsTxt,
  buildSitemap,
  type SeoConfig,
} from './src/config/seo.config';

export const seoBuildPlugin = (seo: SeoConfig): Plugin => ({
  name: 'seo-build',
  closeBundle() {
    const outDir = resolve(process.cwd(), 'dist');

    writeFileSync(resolve(outDir, 'sitemap.xml'), buildSitemap(seo), 'utf-8');
    writeFileSync(resolve(outDir, 'robots.txt'), buildRobotsTxt(seo), 'utf-8');
  },
});
