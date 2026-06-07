/// <reference types="vite/client" />

interface ImportMetaEnv {
  readonly VITE_SITE_URL?: string;
  readonly VITE_SEO_TITLE?: string;
  readonly VITE_SEO_DESCRIPTION?: string;
  readonly VITE_SEO_IMAGE_URL?: string;
  readonly VITE_SEO_PERSON_NAME?: string;
  readonly VITE_SEO_JOB_TITLE?: string;
  readonly VITE_SEO_LOCALE?: string;
  readonly VITE_SEO_EMAIL?: string;
  readonly VITE_SEO_KEYWORDS?: string;
  readonly VITE_LINKEDIN_URL?: string;
  readonly VITE_GOOGLE_SITE_VERIFICATION?: string;
  readonly VITE_YANDEX_SITE_VERIFICATION?: string;
  readonly VITE_GTM_ID?: string;
  readonly VITE_GA_ID?: string;
  readonly VITE_HOTJAR_ID?: string;
  readonly VITE_HOTJAR_VERSION?: string;
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}
