import type { SiteContent } from '../types';
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
  telegramUrl: string;
  keywords: string;
  employer: string;
  googleSiteVerification: string;
  yandexSiteVerification: string;
}

const defaultPersonName = 'Egor Rezvyj';
const defaultJobTitle = 'Go Backend Developer';
const defaultLinkedinUrl = 'https://www.linkedin.com/in/zoomish';
const defaultTelegramUrl = 'https://t.me/ZoomishWork';
const defaultDescription =
  'Egor Rezvyj (Zoomish), Go backend developer. 3+ years of commercial Go: microservices, Kafka, PostgreSQL, gRPC, OpenAPI. Previously frontend. Open to remote Middle+ roles.';

const collapse = (value: string) => value.replace(/\s+/g, ' ').trim();

const truncate = (value: string, max = 300) => {
  const text = collapse(value);
  if (text.length <= max) return text;

  const cut = text.slice(0, max);
  const space = cut.lastIndexOf(' ');
  const trimmed = (space > 180 ? cut.slice(0, space) : cut).trimEnd();

  return `${trimmed}…`;
};

const jobTitleFromHeadline = (headline: string) =>
  headline.split('|')[0]?.trim() || defaultJobTitle;

const keywordsFrom = (
  brand: string,
  name: string,
  job: string,
  headline: string,
) => {
  const parts = headline
    .split(/[|·]/)
    .map((part) => part.trim())
    .filter(Boolean);

  return [...new Set([brand, name, job, ...parts, 'portfolio'])].join(', ');
};

export const resolveSeoConfig = (content: SiteContent): SeoConfig => {
  const profile = content.linkedin.details?.data?.data;
  const info = profile?.basic_info;
  const contact = content.linkedin.contact?.data?.data;
  const brandName = APP_CONFIG.github.username;
  const personName = info?.fullname || defaultPersonName;
  const headline = info?.headline || defaultJobTitle;
  const jobTitle = jobTitleFromHeadline(headline);
  const siteUrl = APP_CONFIG.siteUrl.replace(/\/$/, '');
  const telegramUrl =
    contact?.websites?.find((site) => site.url.includes('t.me'))?.url ||
    defaultTelegramUrl;
  const employer =
    info?.current_company ||
    profile?.experience?.find((item) => item.is_current)?.company ||
    '';

  return {
    siteUrl,
    brandName,
    personName,
    jobTitle,
    title: `${brandName} — ${personName} | ${jobTitle}`,
    description: info?.about ? truncate(info.about) : defaultDescription,
    imageUrl: `${siteUrl}/logo.png`,
    locale: APP_CONFIG.locale,
    email: info?.email || contact?.email || APP_CONFIG.social.email,
    githubUrl: `https://github.com/${brandName}`,
    linkedinUrl: info?.profile_url || defaultLinkedinUrl,
    telegramUrl,
    keywords: keywordsFrom(brandName, personName, jobTitle, headline),
    employer,
    googleSiteVerification: APP_CONFIG.googleSiteVerification,
    yandexSiteVerification: '',
  };
};

export const buildJsonLd = (config: SeoConfig): string => {
  const sameAs = [
    config.githubUrl,
    config.linkedinUrl,
    config.telegramUrl,
  ].filter(Boolean);
  const language = config.locale.split('_')[0];
  const person: Record<string, unknown> = {
    '@type': 'Person',
    '@id': `${config.siteUrl}/#person`,
    name: config.personName,
    alternateName: config.brandName,
    url: config.siteUrl,
    email: config.email,
    jobTitle: config.jobTitle,
    image: config.imageUrl,
    sameAs,
  };

  if (config.employer) {
    person.worksFor = {
      '@type': 'Organization',
      name: config.employer,
    };
  }

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
      person,
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
  const telegramBlock = config.telegramUrl
    ? `<p>Telegram: <a href="${config.telegramUrl}">${config.telegramUrl}</a></p>`
    : '';

  return `<main id="static-seo" aria-label="Портфолио ${config.brandName}">
  <h1>${config.brandName} — ${config.personName}</h1>
  <p>${config.jobTitle}</p>
  <p>${config.description}</p>
  <p>GitHub: <a href="${config.githubUrl}">${config.githubUrl}</a></p>
  ${linkedinBlock}
  ${telegramBlock}
  <p>Почта: <a href="mailto:${config.email}">${config.email}</a></p>
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
