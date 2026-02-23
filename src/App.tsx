import { useEffect, useState } from 'react';
import { HelmetProvider } from 'react-helmet-async';
import { hotjar } from 'react-hotjar';
import { useGithubRepos, useLinkedinAll } from './api/queries';
import { APP_CONFIG } from './config/app.config';
import { BG_COLOR, LOCAL_STORAGE_KEY_NAME } from './constants';
import { DEFAULT_THEMES } from './constants/defaultThemes';
import AboutCard from './components/aboutCard';
import AvatarCard from './components/avatarCard';
import DetailsCard from './components/detailsCard';
import EducationCard from './components/educationCard';
import ExperienceCard from './components/experienceCard';
import ExternalProjectCard from './components/externalProjectCard';
import Footer from './components/footer';
import GithubCard from './components/githubCard';
import HeadTagEditor from './components/headTagEditor';
import PublicationsCard from './components/publicationsCard';
import SkillCard from './components/skillCard';

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

  const { data: githubData, isLoading: githubLoading } = useGithubRepos();
  const { data: linkedinData, isLoading: linkedinLoading } = useLinkedinAll();

  const loading = linkedinLoading;

  const profile = linkedinData?.details?.data?.data?.basic_info ?? null;
  const experience = linkedinData?.details?.data?.data?.experience ?? [];
  const education = linkedinData?.details?.data?.data?.education ?? [];
  const contactData = linkedinData?.contact?.data?.data ?? null;
  const posts = linkedinData?.posts?.data?.data?.posts ?? [];
  const repos = githubData?.data ?? [];
  const skills = profile?.top_skills ?? [];

  useEffect(() => {
    setTheme(getInitialTheme());

    const hotjarId = import.meta.env.VITE_HOTJAR_ID;
    const hotjarVersion = Number(import.meta.env.VITE_HOTJAR_VERSION) || 6;
    if (hotjarId) {
      hotjar.initialize({ id: Number(hotjarId), sv: hotjarVersion });
    }
  }, []);

  useEffect(() => {
    if (theme) document.documentElement.setAttribute('data-theme', theme);
  }, [theme]);

  const googleAnalyticsId = import.meta.env.VITE_GA_ID;
  const { externalProjects, themeConfig, footer } = APP_CONFIG;

  return (
    <HelmetProvider>
      <div className="fade-in h-screen">
        <HeadTagEditor
          googleAnalyticsId={googleAnalyticsId}
          appliedTheme={theme}
        />
        <div className={`p-4 lg:p-10 min-h-full ${BG_COLOR}`}>
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 rounded-box">
            {/* ── Left sidebar ───────────────────────────────────── */}
            <div className="col-span-1">
              <div className="grid grid-cols-1 gap-6">
                {/* {!themeConfig.disableSwitch && (
                  <ThemeChanger
                    theme={theme}
                    setTheme={setTheme}
                    loading={loading}
                    themeConfig={themeConfig}
                  />
                )} */}
                <AvatarCard
                  profile={profile}
                  loading={loading}
                  avatarRing={themeConfig.displayAvatarRing}
                  resumeFileUrl={APP_CONFIG.resume.fileUrl}
                />
                <DetailsCard
                  profile={profile}
                  contact={contactData}
                  loading={loading}
                  githubUsername={APP_CONFIG.github.username}
                  fallbackEmail={APP_CONFIG.social.email}
                />
                {(loading || skills.length > 0) && (
                  <SkillCard loading={loading} skills={skills} />
                )}
                {(loading || experience.length > 0) && (
                  <ExperienceCard loading={loading} experiences={experience} />
                )}
                {(loading || education.length > 0) && (
                  <EducationCard loading={loading} educations={education} />
                )}
              </div>
            </div>

            {/* ── Main content ───────────────────────────────────── */}
            <div className="lg:col-span-2 col-span-1">
              <div className="grid grid-cols-1 gap-6">
                <GithubCard repos={repos} loading={githubLoading} />
                <AboutCard about={profile?.about ?? null} loading={loading} />
                {posts.length > 0 || linkedinLoading ? (
                  <PublicationsCard posts={posts} loading={linkedinLoading} />
                ) : null}
                {externalProjects.projects.length > 0 && (
                  <ExternalProjectCard
                    loading={false}
                    header={externalProjects.header}
                    externalProjects={externalProjects.projects}
                    googleAnalyticId={googleAnalyticsId}
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
