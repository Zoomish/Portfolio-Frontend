import { useEffect, useState } from 'react';
import { HelmetProvider } from 'react-helmet-async';
import { hotjar } from 'react-hotjar';
import AboutCard from './components/aboutCard';
import AvatarCard from './components/avatarCard';
import EducationCard from './components/educationCard';
import ExperienceCard from './components/experienceCard';
import ExternalProjectCard from './components/externalProjectCard';
import Footer from './components/footer';
import GithubCard from './components/githubCard';
import HeadTagEditor from './components/headTagEditor';
import PublicationsCard from './components/publicationsCard';
import SkillCard from './components/skillCard';
import { APP_CONFIG } from './config/app.config';
import { BG_COLOR, LOCAL_STORAGE_KEY_NAME } from './constants';
import { DEFAULT_THEMES } from './constants/defaultThemes';
import siteContentJson from './generated/site-content.json';
import type {
    FilteredRepo,
    LinkedInEducation,
    LinkedInExperience,
    LinkedInPost,
    SiteContent,
} from './types';
import { asArray } from './utils';

const siteContent = siteContentJson as SiteContent;

const getInitialTheme = (): string => {
  const { themeConfig } = APP_CONFIG;

  if (themeConfig.respectPrefersColorScheme && !themeConfig.disableSwitch) {
    const prefersDark = window.matchMedia(
      '(prefers-color-scheme: dark)',
    ).matches;
    return prefersDark ? 'dark' : 'light';
  }

  if (!themeConfig.disableSwitch) {
    const saved = localStorage.getItem(LOCAL_STORAGE_KEY_NAME);
    if (saved && themeConfig.themes.includes(saved)) return saved;
  }

  return themeConfig.defaultTheme;
};

function App() {
  const [theme, setTheme] = useState<string>(DEFAULT_THEMES[0]);

  const loading = false;
  const linkedinData = siteContent.linkedin;
  const profile = linkedinData?.details?.data?.data?.basic_info ?? null;
  const experience = asArray<LinkedInExperience>(
    linkedinData?.details?.data?.data?.experience,
  );
  const education = asArray<LinkedInEducation>(
    linkedinData?.details?.data?.data?.education,
  );
  const contactData = linkedinData?.contact?.data?.data ?? null;
  const posts = asArray<LinkedInPost>(
    linkedinData?.posts?.data?.data?.posts,
  );
  const repos = asArray<FilteredRepo>(siteContent.github?.data);
  const skills = asArray<string>(profile?.top_skills);

  useEffect(() => {
    setTheme(getInitialTheme());
  }, []);

  useEffect(() => {
    const { hotjarId, hotjarVersion } = APP_CONFIG.analytics;
    if (!hotjarId) return;

    const start = () => {
      hotjar.initialize({ id: hotjarId, sv: hotjarVersion });
    };

    if (typeof window.requestIdleCallback === 'function') {
      const id = window.requestIdleCallback(start);
      return () => window.cancelIdleCallback(id);
    }

    const timer = window.setTimeout(start, 1);
    return () => window.clearTimeout(timer);
  }, []);

  useEffect(() => {
    if (theme) document.documentElement.setAttribute('data-theme', theme);
  }, [theme]);

  const { externalProjects, themeConfig, footer } = APP_CONFIG;

  return (
    <HelmetProvider>
      <div className="fade-in min-h-screen">
        <HeadTagEditor appliedTheme={theme} />
        <div className={`p-4 lg:p-10 min-h-full ${BG_COLOR}`}>
          <div className="grid grid-cols-1 lg:grid-cols-5 gap-6 items-start">
            <div className="col-span-1 lg:col-span-2 lg:sticky lg:top-6 lg:self-start">
              <div className="grid grid-cols-1 gap-3">
                <AvatarCard
                  profile={profile}
                  contact={contactData}
                  loading={loading}
                  avatarRing={themeConfig.displayAvatarRing}
                  resumeFileUrl={APP_CONFIG.resume.fileUrl}
                  githubUsername={APP_CONFIG.github.username}
                  fallbackEmail={APP_CONFIG.social.email}
                />
                {(loading || skills.length > 0) && (
                  <SkillCard loading={loading} skills={skills} />
                )}
                <AboutCard about={profile?.about ?? null} loading={loading} />
                {(loading || education.length > 0) && (
                  <EducationCard loading={loading} educations={education} />
                )}
              </div>
            </div>
            <div className="col-span-1 lg:col-span-3">
              <div className="grid grid-cols-1 gap-6 items-start">
                {(loading || experience.length > 0) && (
                  <ExperienceCard loading={loading} experiences={experience} />
                )}
                <GithubCard repos={repos} loading={loading} />
                {posts.length > 0 ? (
                  <PublicationsCard
                    posts={posts}
                    loading={loading}
                    profileUrl={profile?.profile_url}
                    authorAvatar={profile?.profile_picture_url ?? ''}
                  />
                ) : null}
                {externalProjects.projects?.length > 0 && (
                  <ExternalProjectCard
                    loading={false}
                    header={externalProjects.header}
                    externalProjects={externalProjects.projects}
                  />
                )}
              </div>
            </div>
          </div>
        </div>

        {footer && (
          <footer
            className={`p-4 footer ${BG_COLOR} text-base-content footer-center`}
          >
            <div className="card compact bg-base-100 shadow">
              <Footer content={footer} loading={loading} />
            </div>
          </footer>
        )}
      </div>
    </HelmetProvider>
  );
}

export default App;
