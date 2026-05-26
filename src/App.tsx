import { StatusBar } from 'expo-status-bar';
import React from 'react';
import {
  ActivityIndicator,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import { SafeAreaProvider, SafeAreaView } from 'react-native-safe-area-context';
import { useGithubRepos, useLinkedinAll } from './api/queries';
import AboutCard from './components/aboutCard';
import AvatarCard from './components/avatarCard';
import DetailsCard from './components/detailsCard';
import EducationCard from './components/educationCard';
import ExperienceCard from './components/experienceCard';
import ExternalProjectCard from './components/externalProjectCard';
import Footer from './components/footer';
import GithubCard from './components/githubCard';
import PublicationsCard from './components/publicationsCard';
import SkillCard from './components/skillCard';
import { APP_CONFIG } from './config/app.config';
import { colors, fontSize, radius, spacing } from './theme';
import type {
  FilteredRepo,
  LinkedInEducation,
  LinkedInExperience,
  LinkedInPost,
} from './types';
import { asArray } from './utils';

export default function App() {
  const {
    data: githubData,
    isLoading: githubLoading,
    isError: githubError,
  } = useGithubRepos();
  const {
    data: linkedinData,
    isLoading: linkedinLoading,
    isFetching: linkedinFetching,
    isError: linkedinError,
  } = useLinkedinAll();

  const profileLoading = linkedinLoading || (linkedinFetching && !linkedinError);
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
  const repos = asArray<FilteredRepo>(githubData?.data);
  const skills = asArray<string>(profile?.top_skills);

  const { externalProjects, footer } = APP_CONFIG;
  const showInitialLoader = profileLoading && !profile && !linkedinError;

  return (
    <SafeAreaProvider>
      <SafeAreaView style={styles.safeArea} edges={['top']}>
        <StatusBar style="light" />

        {showInitialLoader && (
          <View style={styles.loaderBar}>
            <ActivityIndicator color={colors.accent} />
            <Text style={styles.loaderText}>Загрузка профиля...</Text>
          </View>
        )}

        {(linkedinError || githubError) && (
          <View style={styles.errorBar}>
            <Text style={styles.errorText}>
              Не удалось загрузить часть данных. Проверь интернет и потяни экран
              вниз для обновления.
            </Text>
          </View>
        )}

        <ScrollView
          style={styles.scrollView}
          contentContainerStyle={styles.content}
          showsVerticalScrollIndicator={false}
        >
          <AvatarCard
            profile={profile}
            loading={profileLoading}
            resumeFileUrl={APP_CONFIG.resume.fileUrl || undefined}
          />

          <DetailsCard
            profile={profile}
            contact={contactData}
            loading={profileLoading}
            githubUsername={APP_CONFIG.github.username}
            fallbackEmail={APP_CONFIG.social.email}
          />

          {(profileLoading || skills.length > 0) && (
            <SkillCard loading={profileLoading} skills={skills} />
          )}

          {(profileLoading || experience.length > 0) && (
            <ExperienceCard loading={profileLoading} experiences={experience} />
          )}

          {(profileLoading || education.length > 0) && (
            <EducationCard loading={profileLoading} educations={education} />
          )}

          <GithubCard repos={repos} loading={githubLoading} />

          <AboutCard about={profile?.about ?? null} loading={profileLoading} />

          {(posts.length > 0 || linkedinLoading) && (
            <PublicationsCard posts={posts} loading={linkedinLoading} />
          )}

          {externalProjects.projects.length > 0 && (
            <ExternalProjectCard
              loading={false}
              header={externalProjects.header}
              externalProjects={[...externalProjects.projects]}
            />
          )}

          {footer && <Footer content={footer} loading={profileLoading} />}

          <View style={{ height: spacing.xxl }} />
        </ScrollView>
      </SafeAreaView>
    </SafeAreaProvider>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: colors.background,
  },
  loaderBar: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: spacing.sm,
    paddingVertical: spacing.sm,
    backgroundColor: colors.cardBg,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
  },
  loaderText: {
    fontSize: fontSize.sm,
    color: colors.textSecondary,
  },
  errorBar: {
    marginHorizontal: spacing.lg,
    marginTop: spacing.sm,
    padding: spacing.md,
    backgroundColor: colors.errorBg,
    borderRadius: radius.md,
    borderWidth: 1,
    borderColor: colors.errorBorder,
  },
  errorText: {
    fontSize: fontSize.sm,
    color: colors.errorText,
    textAlign: 'center',
  },
  scrollView: {
    flex: 1,
  },
  content: {
    padding: spacing.lg,
    gap: spacing.lg,
  },
});
