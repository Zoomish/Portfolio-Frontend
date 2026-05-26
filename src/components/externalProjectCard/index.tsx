import React from 'react';
import { Image, Linking, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import type { ExternalProject } from '../../config/app.config';
import { cardStyles, colors, fontSize, radius, spacing } from '../../theme';
import { Skeleton } from '../../utils';

interface Props {
  externalProjects: ExternalProject[];
  header: string;
  loading: boolean;
}

const ExternalProjectCard: React.FC<Props> = ({
  externalProjects,
  header,
  loading,
}) => {
  if (!loading && externalProjects?.length === 0) return null;

  const renderSkeleton = () =>
    Array.from({ length: 2 }).map((_, i) => (
      <View key={i} style={styles.projectCard}>
        <Skeleton width={120} height={20} />
        <Skeleton width={96} height={96} borderRadius={20} style={{ marginTop: spacing.md, alignSelf: 'center' }} />
        <Skeleton width={'100%' as unknown as number} height={14} style={{ marginTop: spacing.md }} />
      </View>
    ));

  const renderProjects = () =>
    externalProjects.map((item, index) => (
      <TouchableOpacity
        key={index}
        style={styles.projectCard}
        onPress={() => Linking.openURL(item.link)}
        activeOpacity={0.7}
      >
        <Text style={styles.projectTitle}>{item.title}</Text>
        {item.imageUrl && (
          <Image
            source={{ uri: item.imageUrl }}
            style={styles.projectImage}
            resizeMode="cover"
          />
        )}
        {item.description && (
          <Text style={styles.projectDescription}>{item.description}</Text>
        )}
      </TouchableOpacity>
    ));

  return (
    <View style={styles.card}>
      {loading ? (
        <Skeleton width={140} height={24} />
      ) : (
        <Text style={cardStyles.cardTitle}>{header}</Text>
      )}
      <View style={styles.projectsGrid}>
        {loading ? renderSkeleton() : renderProjects()}
      </View>
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
  projectsGrid: {
    gap: spacing.md,
  },
  projectCard: {
    backgroundColor: colors.surface,
    borderRadius: radius.md,
    padding: spacing.lg,
  },
  projectTitle: {
    fontSize: fontSize.md,
    fontWeight: '500',
    color: colors.textSecondary,
    textAlign: 'center',
  },
  projectImage: {
    width: 96,
    height: 96,
    borderRadius: 20,
    alignSelf: 'center',
    marginTop: spacing.md,
  },
  projectDescription: {
    fontSize: fontSize.sm,
    color: colors.textSecondary,
    marginTop: spacing.md,
    lineHeight: 20,
  },
});

export default ExternalProjectCard;
