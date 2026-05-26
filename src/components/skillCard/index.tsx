import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { cardStyles, colors, fontSize, radius, spacing } from '../../theme';
import { Skeleton } from '../../utils';

interface Props {
  loading: boolean;
  skills: string[];
}

const SkillCard: React.FC<Props> = ({ loading, skills }) => {
  const renderSkeleton = () =>
    Array.from({ length: 8 }).map((_, i) => (
      <Skeleton key={i} width={64} height={24} borderRadius={radius.full} style={{ margin: 4 }} />
    ));

  return (
    <View style={styles.card}>
      {loading ? (
        <Skeleton width={120} height={24} />
      ) : (
        <Text style={cardStyles.cardTitle}>Tech Stack</Text>
      )}
      <View style={styles.skillsContainer}>
        {loading
          ? renderSkeleton()
          : skills.map((skill, index) => (
              <View key={index} style={styles.badge}>
                <Text style={styles.badgeText}>{skill}</Text>
              </View>
            ))}
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
  skillsContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'center',
    marginTop: spacing.sm,
  },
  badge: {
    backgroundColor: colors.badgeBg,
    borderRadius: radius.full,
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.xs,
    margin: 4,
  },
  badgeText: {
    color: colors.badgeText,
    fontSize: fontSize.xs,
    fontWeight: '700',
  },
});

export default SkillCard;
