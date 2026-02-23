// src/config/app.config.ts
// Static configuration: theme, resume, external projects, SEO, analytics.
// Dynamic data (profile, experience, skills, posts) comes from the backend API.

export interface ExternalProject {
  title: string;
  description?: string;
  imageUrl?: string;
  link: string;
}

export interface ThemeConfig {
  defaultTheme: string;
  disableSwitch: boolean;
  respectPrefersColorScheme: boolean;
  displayAvatarRing: boolean;
  themes: string[];
  customTheme: {
    primary: string;
    secondary: string;
    accent: string;
    neutral: string;
    'base-100': string;
    '--rounded-box': string;
    '--rounded-btn': string;
  };
}

export const APP_CONFIG = {
  github: {
    username: 'Zoomish',
  },

  resume: {
    fileUrl:
      'https://arkhangelsk.hh.ru/resume_converter/%D0%A0e%D0%B7%D0%B2%D1%8B%D0%B9%20%D0%95%D0%B3%D0%BE%D1%80%20%D0%9E%D0%BBe%D0%B3%D0%BE%D0%B2%D0%B8%D1%87.pdf?hash=7ce57450ff0ea4553f0039ed1f70725473337a&type=pdf&hhtmFrom=resume_list&hhtmSource=resume',
  },

  // Fallback social links (used if not available from LinkedIn contact API)
  social: {
    email: 'zoomish39@gmail.com',
  },

  externalProjects: {
    header: 'My Projects',
    projects: [] as ExternalProject[],
  },

  themeConfig: {
    defaultTheme: 'lofi',
    disableSwitch: false,
    respectPrefersColorScheme: false,
    displayAvatarRing: true,
    themes: [
      'light',
      'dark',
      'cupcake',
      'bumblebee',
      'emerald',
      'corporate',
      'synthwave',
      'retro',
      'cyberpunk',
      'valentine',
      'halloween',
      'garden',
      'forest',
      'aqua',
      'lofi',
      'pastel',
      'fantasy',
      'wireframe',
      'black',
      'luxury',
      'dracula',
      'cmyk',
      'autumn',
      'business',
      'acid',
      'lemonade',
      'night',
      'coffee',
      'winter',
      'dim',
      'nord',
      'sunset',
      'procyon',
    ],
    customTheme: {
      primary: '#fc055b',
      secondary: '#219aaf',
      accent: '#e8d03a',
      neutral: '#2A2730',
      'base-100': '#E3E3ED',
      '--rounded-box': '3rem',
      '--rounded-btn': '3rem',
    },
  } as ThemeConfig,

  footer: 'Made by Zoomish',

  enablePWA: true,
} as const;
