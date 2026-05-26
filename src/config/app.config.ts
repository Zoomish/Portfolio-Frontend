export interface ExternalProject {
  title: string;
  description?: string;
  imageUrl?: string;
  link: string;
}

export const APP_CONFIG = {
  github: {
    username: 'Zoomish',
  },

  resume: {
    fileUrl: '',
  },

  social: {
    email: 'zoomish39@gmail.com',
  },

  externalProjects: {
    header: 'My Projects',
    projects: [] as ExternalProject[],
  },

  footer: 'Made by Zoomish',
} as const;
