import { APP_CONFIG } from './app.config';

export interface SeoConfig {
  siteUrl: string;
  title: string;
  description: string;
  imageUrl: string;
  brandName: string;
  personName: string;
  jobTitle: string;
  locale: string;
  email: string;
  githubUrl: string;
  linkedinUrl: string;
  keywords: string;
  googleSiteVerification: string;
  yandexSiteVerification: string;
}

const defaultSiteUrl = 'https://zoomish-portfolio.vercel.app';
const defaultPersonName = 'Egor Rezvyi';
const defaultJobTitle = 'Senior Frontend Developer';
const defaultDescription =
  'Я Резвый Егор (Zoomish), Senior Frontend developer с 6+ годами опыта. Портфолио, проекты на GitHub, опыт работы и навыки.';

const trimTrailingSlash = (url: string) => url.replace(/\/$/, '');

export const resolveSeoConfig = (
  env: Record<string, string> = {},
): SeoConfig => {
  const brandName = APP_CONFIG.github.username;
  const siteUrl = trimTrailingSlash(env.VITE_SITE_URL || defaultSiteUrl);
  const personName = env.VITE_SEO_PERSON_NAME || defaultPersonName;
  const jobTitle = env.VITE_SEO_JOB_TITLE || defaultJobTitle;

  return {
    siteUrl,
    brandName,
    personName,
    jobTitle,
    title:
      env.VITE_SEO_TITLE ||
      `${brandName} — ${personName} | ${jobTitle}`,
    description: env.VITE_SEO_DESCRIPTION || defaultDescription,
    imageUrl: env.VITE_SEO_IMAGE_URL || `${siteUrl}/logo.png`,
    locale: env.VITE_SEO_LOCALE || 'ru_RU',
    email: env.VITE_SEO_EMAIL || APP_CONFIG.social.email,
    githubUrl: `https://github.com/${brandName}`,
    linkedinUrl: env.VITE_LINKEDIN_URL || '',
    keywords:
      env.VITE_SEO_KEYWORDS ||
      `${brandName}, ${personName}, frontend developer, React, TypeScript, portfolio`,
    googleSiteVerification: env.VITE_GOOGLE_SITE_VERIFICATION || '',
    yandexSiteVerification: env.VITE_YANDEX_SITE_VERIFICATION || '',
  };
};

export const buildJsonLd = (config: SeoConfig): string => {
  const sameAs = [config.githubUrl, config.linkedinUrl].filter(Boolean);
  const language = config.locale.split('_')[0];

  return JSON.stringify({
    '@context': 'https://schema.org',
    '@graph': [
      {
        '@type': 'WebSite',
        '@id': `${config.siteUrl}/#website`,
        url: config.siteUrl,
        name: config.title,
        description: config.description,
        inLanguage: language,
        publisher: { '@id': `${config.siteUrl}/#person` },
      },
      {
        '@type': 'Person',
        '@id': `${config.siteUrl}/#person`,
        name: config.personName,
        alternateName: config.brandName,
        url: config.siteUrl,
        email: config.email,
        jobTitle: config.jobTitle,
        image: config.imageUrl,
        sameAs,
      },
      {
        '@type': 'ProfilePage',
        '@id': `${config.siteUrl}/#profilepage`,
        url: config.siteUrl,
        name: config.title,
        description: config.description,
        mainEntity: { '@id': `${config.siteUrl}/#person` },
        isPartOf: { '@id': `${config.siteUrl}/#website` },
      },
    ],
  });
};

export const buildStaticSeoHtml = (config: SeoConfig): string => {
  const linkedinBlock = config.linkedinUrl
    ? `<p>LinkedIn: <a href="${config.linkedinUrl}">${config.linkedinUrl}</a></p>`
    : '';

  return `<main id="static-seo" aria-label="${config.brandName} portfolio">
  <h1>${config.brandName} — ${config.personName}</h1>
  <p>${config.jobTitle}</p>
  <p>${config.description}</p>
  <p>GitHub: <a href="${config.githubUrl}">${config.githubUrl}</a></p>
  ${linkedinBlock}
  <p>Email: <a href="mailto:${config.email}">${config.email}</a></p>
</main>`;
};

export const buildSitemap = (config: SeoConfig): string => {
  const lastmod = new Date().toISOString().split('T')[0];

  return `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
  <url>
    <loc>${config.siteUrl}/</loc>
    <lastmod>${lastmod}</lastmod>
    <changefreq>weekly</changefreq>
    <priority>1.0</priority>
  </url>
</urlset>`;
};

export const buildRobotsTxt = (config: SeoConfig): string => {
  return `# https://www.robotstxt.org/robotstxt.html
User-agent: *
Allow: /

Sitemap: ${config.siteUrl}/sitemap.xml
`;
};

export const buildHtmlInjectData = (config: SeoConfig) => ({
  metaTitle: config.title,
  metaDescription: config.description,
  metaImageURL: config.imageUrl,
  siteUrl: config.siteUrl,
  canonicalUrl: `${config.siteUrl}/`,
  ogSiteName: `${config.brandName} Portfolio`,
  ogLocale: config.locale,
  metaKeywords: config.keywords,
  jsonLd: buildJsonLd(config),
  staticSeoHtml: buildStaticSeoHtml(config),
  googleSiteVerification: config.googleSiteVerification,
  yandexSiteVerification: config.yandexSiteVerification,
});
