import React, { Fragment } from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { cardStyles, colors, fontSize, radius, spacing } from '../../theme';
import type { LinkedInEducation } from '../../types';
import { Skeleton } from '../../utils';

interface Props {
  loading: boolean;
  educations: LinkedInEducation[];
}

const TimelineItem: React.FC<{
  time: string;
  degree: string;
  institution: string;
  isLast?: boolean;
}> = ({ time, degree, institution, isLast }) => (
  <View style={styles.timelineItem}>
    <View style={styles.timelineIndicator}>
      <View style={styles.dot} />
      {!isLast && <View style={styles.line} />}
    </View>
    <View style={styles.timelineContent}>
      <Text style={styles.time}>{time}</Text>
      <Text style={styles.degree}>{degree}</Text>
      <Text style={styles.institution}>{institution}</Text>
    </View>
  </View>
);

const EducationCard: React.FC<Props> = ({ loading, educations }) => {
  const renderSkeleton = () =>
    Array.from({ length: 2 }).map((_, i) => (
      <View key={i} style={[styles.timelineItem, { marginBottom: spacing.lg }]}>
        <View style={styles.timelineIndicator}>
          <View style={styles.dot} />
          {i < 1 && <View style={styles.line} />}
        </View>
        <View style={styles.timelineContent}>
          <Skeleton width={100} height={14} />
          <Skeleton width={160} height={16} style={{ marginTop: spacing.xs }} />
          <Skeleton width={120} height={14} style={{ marginTop: spacing.xs }} />
        </View>
      </View>
    ));

  return (
    <View style={styles.card}>
      {loading ? (
        <Skeleton width={120} height={24} />
      ) : (
        <Text style={cardStyles.cardTitle}>Education</Text>
      )}
      {loading ? (
        renderSkeleton()
      ) : (
        <Fragment>
          {educations.map((item, index) => (
            <TimelineItem
              key={index}
              time={item.duration}
              degree={item.degree}
              institution={item.school}
              isLast={index === educations.length - 1}
            />
          ))}
        </Fragment>
      )}
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
  timelineItem: {
    flexDirection: 'row',
    marginBottom: spacing.md,
  },
  timelineIndicator: {
    alignItems: 'center',
    width: 20,
    marginRight: spacing.md,
  },
  dot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: colors.timelineDot,
    marginTop: 4,
  },
  line: {
    flex: 1,
    width: 1,
    backgroundColor: colors.timelineLine,
    marginTop: 4,
  },
  timelineContent: {
    flex: 1,
    paddingBottom: spacing.sm,
  },
  time: {
    fontSize: fontSize.xs,
    color: colors.textMuted,
  },
  degree: {
    fontSize: fontSize.md,
    fontWeight: '600',
    color: colors.textPrimary,
    marginTop: 2,
  },
  institution: {
    fontSize: fontSize.sm,
    color: colors.textSecondary,
    marginTop: 2,
    marginBottom: spacing.sm,
  },
});

export default EducationCard;
