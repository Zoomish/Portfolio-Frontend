import { Ionicons } from '@expo/vector-icons';
import React from 'react';
import { Linking, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { cardStyles, colors, fontSize, languageColors, radius, spacing } from '../../theme';
import type { FilteredRepo } from '../../types';
import { Skeleton } from '../../utils';

interface Props {
  repos: FilteredRepo[];
  loading: boolean;
}

const RepoCard: React.FC<{ repo: FilteredRepo }> = ({ repo }) => {
  const langColor = languageColors[repo.language] || colors.textMuted;

  return (
    <View style={styles.repoCard}>
      <View style={styles.repoHeader}>
        <Text style={styles.repoName} numberOfLines={1}>
          {repo.name}
        </Text>
        <View style={styles.repoLinks}>
          {repo.link && (
            <TouchableOpacity onPress={() => Linking.openURL(repo.link!)}>
              <Ionicons name="open-outline" size={14} color={colors.textMuted} />
            </TouchableOpacity>
          )}
          <TouchableOpacity onPress={() => Linking.openURL(repo.url)}>
            <Ionicons name="logo-github" size={16} color={colors.textMuted} />
          </TouchableOpacity>
        </View>
      </View>

      <Text style={styles.repoDescription} numberOfLines={3}>
        {repo.description || 'No description provided.'}
      </Text>

      <View style={styles.repoMeta}>
        {repo.language && (
          <View style={styles.metaItem}>
            <View style={[styles.langDot, { backgroundColor: langColor }]} />
            <Text style={styles.metaText}>{repo.language}</Text>
          </View>
        )}
        {repo.stars > 0 && (
          <View style={styles.metaItem}>
            <Ionicons name="star" size={12} color={colors.textMuted} />
            <Text style={styles.metaText}>{repo.stars}</Text>
          </View>
        )}
        {repo.forks > 0 && (
          <View style={styles.metaItem}>
            <Ionicons name="git-branch" size={12} color={colors.textMuted} />
            <Text style={styles.metaText}>{repo.forks}</Text>
          </View>
        )}
      </View>
    </View>
  );
};

const GithubCard: React.FC<Props> = ({ repos, loading }) => {
  const safeRepos = Array.isArray(repos) ? repos : [];
  const sortedRepos = [...safeRepos].sort((a, b) => b.stars - a.stars);

  const renderSkeleton = () =>
    Array.from({ length: 4 }).map((_, i) => (
      <View key={i} style={styles.repoCard}>
        <Skeleton width={160} height={16} />
        <Skeleton width={'100%' as unknown as number} height={12} style={{ marginTop: spacing.sm }} />
        <Skeleton width={'75%' as unknown as number} height={12} style={{ marginTop: spacing.xs }} />
        <Skeleton width={80} height={14} style={{ marginTop: spacing.md }} />
      </View>
    ));

  return (
    <View style={styles.card}>
      <Text style={cardStyles.cardTitle}>Github Projects</Text>
      {loading ? renderSkeleton() : sortedRepos.map((repo) => (
        <RepoCard key={repo.name} repo={repo} />
      ))}
    </View>
  );
};

const styles = StyleSheet.create({
  card: {
    backgroundColor: colors.cardBg,
    borderRadius: radius.lg,
    padding: spacing.lg,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 8,
    elevation: 3,
  },
  repoCard: {
    backgroundColor: colors.surface,
    borderRadius: radius.md,
    padding: spacing.lg,
    marginBottom: spacing.sm,
  },
  repoHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: spacing.sm,
  },
  repoName: {
    flex: 1,
    fontSize: fontSize.sm,
    fontWeight: '600',
    color: colors.textPrimary,
    opacity: 0.8,
    marginRight: spacing.sm,
  },
  repoLinks: {
    flexDirection: 'row',
    gap: spacing.sm,
  },
  repoDescription: {
    fontSize: fontSize.xs,
    color: colors.textMuted,
    lineHeight: 18,
    marginBottom: spacing.md,
  },
  repoMeta: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.md,
    flexWrap: 'wrap',
  },
  metaItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  langDot: {
    width: 10,
    height: 10,
    borderRadius: 5,
  },
  metaText: {
    fontSize: fontSize.xs,
    color: colors.textMuted,
    fontFamily: 'monospace',
  },
});

export default GithubCard;
